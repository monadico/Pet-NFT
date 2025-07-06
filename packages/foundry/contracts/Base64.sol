// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

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