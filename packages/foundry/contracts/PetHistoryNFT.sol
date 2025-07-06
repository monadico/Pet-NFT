// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "./Base64.sol";

contract PetHistoryNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct HistoryItem {
        string title;
        string description;
        string fileURI; // IPFS URI for the uploaded file
        string fileType; // "image" or "pdf"
        uint256 timestamp;
        address parentContract; // Address of the parent NFT contract (PetNFT)
        uint256 parentTokenId; // Token ID of the parent pet NFT
    }

    mapping(uint256 => HistoryItem) private _historyItems;
    
    // Mapping from parent contract + token ID to array of nested history item token IDs
    mapping(address => mapping(uint256 => uint256[])) private _nestedItems;
    
    // Mapping from history item token ID to its parent info
    mapping(uint256 => bool) private _isNested;

    event HistoryItemNested(
        uint256 indexed historyTokenId,
        address indexed parentContract,
        uint256 indexed parentTokenId
    );

    event HistoryItemUnnested(
        uint256 indexed historyTokenId,
        address indexed parentContract,
        uint256 indexed parentTokenId
    );

    constructor(address initialOwner) ERC721("PetHistoryNFT", "PETHIST") Ownable(initialOwner) {}

    function mintHistoryItem(
        address to,
        string memory title,
        string memory description,
        string memory fileURI,
        string memory fileType,
        address parentContract,
        uint256 parentTokenId
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        _historyItems[tokenId] = HistoryItem({
            title: title,
            description: description,
            fileURI: fileURI,
            fileType: fileType,
            timestamp: block.timestamp,
            parentContract: parentContract,
            parentTokenId: parentTokenId
        });

        // Automatically nest the item under the parent pet
        _nestItem(tokenId, parentContract, parentTokenId);

        return tokenId;
    }

    function _nestItem(uint256 historyTokenId, address parentContract, uint256 parentTokenId) internal {
        require(_ownerOf(historyTokenId) != address(0), "History item does not exist");
        require(!_isNested[historyTokenId], "History item already nested");

        _nestedItems[parentContract][parentTokenId].push(historyTokenId);
        _isNested[historyTokenId] = true;

        emit HistoryItemNested(historyTokenId, parentContract, parentTokenId);
    }

    function unnestItem(uint256 historyTokenId) public {
        require(_ownerOf(historyTokenId) == msg.sender, "Not the owner of history item");
        require(_isNested[historyTokenId], "History item not nested");

        HistoryItem memory item = _historyItems[historyTokenId];
        
        // Remove from nested items array
        uint256[] storage nestedArray = _nestedItems[item.parentContract][item.parentTokenId];
        for (uint256 i = 0; i < nestedArray.length; i++) {
            if (nestedArray[i] == historyTokenId) {
                nestedArray[i] = nestedArray[nestedArray.length - 1];
                nestedArray.pop();
                break;
            }
        }

        _isNested[historyTokenId] = false;

        emit HistoryItemUnnested(historyTokenId, item.parentContract, item.parentTokenId);
    }

    function getNestedItems(address parentContract, uint256 parentTokenId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return _nestedItems[parentContract][parentTokenId];
    }

    function getHistoryItem(uint256 tokenId) public view returns (HistoryItem memory) {
        require(_ownerOf(tokenId) != address(0), "History item does not exist");
        return _historyItems[tokenId];
    }

    function isNested(uint256 tokenId) public view returns (bool) {
        return _isNested[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "History item does not exist");

        HistoryItem memory item = _historyItems[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                item.title,
                '", "description": "',
                item.description,
                '", "image": "',
                item.fileURI,
                '", "attributes": [',
                '{"trait_type": "File Type", "value": "',
                item.fileType,
                '"},',
                '{"trait_type": "Timestamp", "value": "',
                Strings.toString(item.timestamp),
                '"},',
                '{"trait_type": "Parent Contract", "value": "',
                Strings.toHexString(uint160(item.parentContract), 20),
                '"},',
                '{"trait_type": "Parent Token ID", "value": "',
                Strings.toString(item.parentTokenId),
                '"}]}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }
}

 