// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/PetHistoryNFT.sol";

contract DeployPetHistoryNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        PetHistoryNFT petHistoryNFT = new PetHistoryNFT(deployer);

        console.log("PetHistoryNFT deployed to:", address(petHistoryNFT));
        console.log("Deployed by:", deployer);
        
        vm.stopBroadcast();
    }
} 