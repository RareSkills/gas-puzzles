// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract ArraySort {
    function sortArray(uint256[] memory data) external pure returns (uint256[] memory) {
        for (uint256 i = 0; i < data.length; i++) {
            for (uint256 j = i+1; j < data.length; j++) {
                if(data[i] > data[j]){
                    uint256 temp = data[i];
                    data[i] = data[j];
                    data[j] = temp;
                }
            }
        }
        return data;
    }
}
