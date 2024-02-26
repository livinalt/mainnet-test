// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

interface IERC20{
    function approve(address _spender, uint _value) external;
    function balanceOf(address who) external view returns(uint256 balance);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}