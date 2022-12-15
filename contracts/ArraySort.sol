// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

contract ArraySort {
    function sortArray(uint256[] calldata data) external pure returns (uint256[] memory) {
        uint256 dataLen = data.length;

        // Create 'working' copy
        uint[] memory _data = new uint256[](dataLen);
        for (uint256 k = 0; k < _data.length; k++) {
            _data[k] = data[k];
        }

        for (uint256 i = 0; i < _data.length; i++) {
            for (uint256 j = i+1; j < _data.length; j++) {
                if(_data[i] > _data[j]){
                    uint256 temp = _data[i];
                    _data[i] = _data[j];
                    _data[j] = temp;
                }
            }
        }
        return _data;
    }
}
