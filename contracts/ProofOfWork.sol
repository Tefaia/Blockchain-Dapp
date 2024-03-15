// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofOfWork {
    uint public difficulty = 10**32; // Example difficulty as uint

    function mine(uint nonce, bytes32 currentChallenge) public pure returns (bytes8) {
    bytes8 n = bytes8(sha256(abi.encodePacked(nonce, currentChallenge)));
    return n;
}

}
