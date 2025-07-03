// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract PetNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct PetInfo {
        string petName;
        string petOwner;
        string petBirth;
        string imageURI;
    }

    mapping(uint256 => PetInfo) private _petInfo;

    constructor(address initialOwner) ERC721("PetNFT", "PET") Ownable(initialOwner) {}

    function safeMint(address to, string memory petName, string memory petOwner, string memory petBirth, string memory imageURI) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _petInfo[tokenId] = PetInfo(petName, petOwner, petBirth, imageURI);
    }

    // This function is called on mint and transfer.
    // We only allow the transaction if the "from" address is the zero address (i.e., on mint).
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Token is soulbound and cannot be transferred.");
        }
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // The ownerOf function will revert if the token does not exist.
        // This check is implicitly handled by the line below.
        ownerOf(tokenId);

        PetInfo memory info = _petInfo[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                info.petName,
                '", "description": "A soulbound NFT for your beloved pet.", "image": "',
                info.imageURI,
                '", "attributes": [',
                '{"trait_type": "Owner", "value": "',
                info.petOwner,
                '"},',
                '{"trait_type": "Birth Date", "value": "',
                info.petBirth,
                '"}]}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", _Base64.encode(bytes(json))));
    }
}

// solhint-disable-next-line no-inline-assembly
library _Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        string memory result = new string(4 * ((data.length + 2) / 3));
        bytes memory resultBytes = bytes(result);

        uint256 i = 0;
        uint256 j = 0;
        while (i < data.length) {
            uint256 b = uint256(uint8(data[i++]));
            resultBytes[j++] = TABLE[b >> 2];
            if (i < data.length) {
                b = (b & 0x03) << 8 | uint256(uint8(data[i++]));
                resultBytes[j++] = TABLE[(b >> 4) & 0x3F];
                if (i < data.length) {
                    b = (b & 0x0F) << 8 | uint256(uint8(data[i++]));
                    resultBytes[j++] = TABLE[(b >> 6) & 0x3F];
                    resultBytes[j++] = TABLE[b & 0x3F];
                } else {
                    resultBytes[j++] = TABLE[(b & 0x0F) << 2];
                    resultBytes[j++] = '=';
                }
            } else {
                resultBytes[j++] = TABLE[(b & 0x03) << 4];
                resultBytes[j++] = '=';
                resultBytes[j++] = '=';
            }
        }

        return result;
    }
} 