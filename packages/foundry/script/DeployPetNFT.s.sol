// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/PetNFT.sol";

contract DeployPetNFT is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        new PetNFT(deployer);
    }
} 