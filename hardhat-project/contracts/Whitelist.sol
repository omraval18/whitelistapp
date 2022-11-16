pragma solidity ^0.8.9;

contract Whitelist {
    uint8 maxWhitelistAddresses;
    // keep track of the number of addresses in the whitelist
    uint8 numWhitelistedAddresses;
    // set to true if address is whitelisted. default false.
    mapping(address=>bool) public whitelistAddresses;

    // user can put the value of the maxWhitelistAddresses

    constructor(uint8 _maxWhitelistAddresses) {
        maxWhitelistAddresses = _maxWhitelistAddresses;
    }

    // Add an address to the whitelist
    function addAddressToWhitelist() public {
        // check if user is already whitelisted
        require(!whitelistAddresses[msg.sender],"User already exists");
        // check if number < maxNumber
        require(numWhitelistedAddresses < maxWhitelistAddresses, "Whitelist is full");
        whitelistAddresses[msg.sender]=true;
        // increase the number
        numWhitelistedAddresses +=1;

    }
    

}

