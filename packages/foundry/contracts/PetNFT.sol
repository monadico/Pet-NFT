// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "./Base64.sol";

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

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}

