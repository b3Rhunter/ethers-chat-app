// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string message;
    }

    Message[] public messages;

    event NewMessage(address sender, string message);

    function sendMessage(string memory message) public {
        messages.push(Message(msg.sender, message));
        emit NewMessage(msg.sender, message);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}
