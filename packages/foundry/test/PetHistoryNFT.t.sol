// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/PetHistoryNFT.sol";
import "../contracts/PetNFT.sol";

contract PetHistoryNFTTest is Test {
    PetHistoryNFT public petHistoryNFT;
    PetNFT public petNFT;
    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        vm.startPrank(owner);
        petHistoryNFT = new PetHistoryNFT(owner);
        petNFT = new PetNFT(owner);
        vm.stopPrank();
    }

    function testMintHistoryItem() public {
        // First, mint a pet NFT
        vm.prank(owner);
        petNFT.safeMint(user, "Fluffy", "Alice", "2020-01-01", "ipfs://pet-image");

        // Now mint a history item for this pet
        vm.prank(owner);
        uint256 historyTokenId = petHistoryNFT.mintHistoryItem(
            user,
            "Vaccination Record",
            "Annual vaccination completed",
            "ipfs://vaccination-record",
            "pdf",
            address(petNFT),
            0 // Pet token ID
        );

        // Verify the history item was created
        assertEq(petHistoryNFT.ownerOf(historyTokenId), user);
        assertTrue(petHistoryNFT.isNested(historyTokenId));

        // Verify the history item details
        PetHistoryNFT.HistoryItem memory item = petHistoryNFT.getHistoryItem(historyTokenId);
        assertEq(item.title, "Vaccination Record");
        assertEq(item.description, "Annual vaccination completed");
        assertEq(item.fileURI, "ipfs://vaccination-record");
        assertEq(item.fileType, "pdf");
        assertEq(item.parentContract, address(petNFT));
        assertEq(item.parentTokenId, 0);
    }

    function testGetNestedItems() public {
        // First, mint a pet NFT
        vm.prank(owner);
        petNFT.safeMint(user, "Fluffy", "Alice", "2020-01-01", "ipfs://pet-image");

        // Mint multiple history items for this pet
        vm.startPrank(owner);
        uint256 historyTokenId1 = petHistoryNFT.mintHistoryItem(
            user,
            "Vaccination Record",
            "Annual vaccination completed",
            "ipfs://vaccination-record",
            "pdf",
            address(petNFT),
            0
        );

        uint256 historyTokenId2 = petHistoryNFT.mintHistoryItem(
            user,
            "Vet Visit Photo",
            "Photo from vet visit",
            "ipfs://vet-photo",
            "image",
            address(petNFT),
            0
        );
        vm.stopPrank();

        // Get nested items
        uint256[] memory nestedItems = petHistoryNFT.getNestedItems(address(petNFT), 0);
        assertEq(nestedItems.length, 2);
        assertEq(nestedItems[0], historyTokenId1);
        assertEq(nestedItems[1], historyTokenId2);
    }

    function testUnnestItem() public {
        // First, mint a pet NFT
        vm.prank(owner);
        petNFT.safeMint(user, "Fluffy", "Alice", "2020-01-01", "ipfs://pet-image");

        // Mint a history item for this pet
        vm.prank(owner);
        uint256 historyTokenId = petHistoryNFT.mintHistoryItem(
            user,
            "Vaccination Record",
            "Annual vaccination completed",
            "ipfs://vaccination-record",
            "pdf",
            address(petNFT),
            0
        );

        // Verify it's nested
        assertTrue(petHistoryNFT.isNested(historyTokenId));

        // Unnest the item
        vm.prank(user);
        petHistoryNFT.unnestItem(historyTokenId);

        // Verify it's no longer nested
        assertFalse(petHistoryNFT.isNested(historyTokenId));

        // Verify nested items array is empty
        uint256[] memory nestedItems = petHistoryNFT.getNestedItems(address(petNFT), 0);
        assertEq(nestedItems.length, 0);
    }

    function testTokenURI() public {
        // First, mint a pet NFT
        vm.prank(owner);
        petNFT.safeMint(user, "Fluffy", "Alice", "2020-01-01", "ipfs://pet-image");

        // Mint a history item for this pet
        vm.prank(owner);
        uint256 historyTokenId = petHistoryNFT.mintHistoryItem(
            user,
            "Vaccination Record",
            "Annual vaccination completed",
            "ipfs://vaccination-record",
            "pdf",
            address(petNFT),
            0
        );

        // Get token URI
        string memory tokenURI = petHistoryNFT.tokenURI(historyTokenId);
        
        // Verify it has content
        assertTrue(bytes(tokenURI).length > 0);
        
        // Verify it contains the expected prefix (simple check)
        bytes memory tokenURIBytes = bytes(tokenURI);
        bytes memory expectedPrefix = bytes("data:application/json;base64,");
        
        // Check if the URI starts with the expected prefix
        bool startsWithPrefix = true;
        if (tokenURIBytes.length < expectedPrefix.length) {
            startsWithPrefix = false;
        } else {
            for (uint i = 0; i < expectedPrefix.length; i++) {
                if (tokenURIBytes[i] != expectedPrefix[i]) {
                    startsWithPrefix = false;
                    break;
                }
            }
        }
        assertTrue(startsWithPrefix);
    }
} 