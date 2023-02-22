import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const CHAT_CONTRACT_ADDRESS = "0x85ecbF67C84171E87E78c1e6E77FF1288aeD3D49"; // replace with your smart contract address

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [wallet, setWallet] = useState(null);
  const [chatContract, setChatContract] = useState(null);

  function handleMessageEvent(sender, message) {
    setMessages((messages) => [...messages, { sender, message }]);
  }

  useEffect(() => {
    async function connectToNetwork() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const wallet = provider.getSigner();
      setWallet(wallet);

      const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"NewMessage","type":"event"},{"inputs":[],"name":"getMessages","outputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"message","type":"string"}],"internalType":"struct Chat.Message[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"messages","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"string","name":"message","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"message","type":"string"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"}]; 
      const contract = new ethers.Contract(CHAT_CONTRACT_ADDRESS, abi, wallet);
      setChatContract(contract);

      contract.on("NewMessage", handleMessageEvent);
    }

    connectToNetwork();
  }, []);

  async function sendMessage() {
    await chatContract.sendMessage(currentMessage);
    setCurrentMessage("");
  }

  async function displayMessages() {
    const messages = await chatContract.getMessages();
    setMessages(messages);
  }

  return (
    <div className="App">
      <div className="App-header">
      <div>
      {messages.map((message, i) => (
        <div key={i}>
          <p style={{fontSize: "12px"}}>from: {message.sender}</p>
          <p style={{fontSize: "18px"}}>{message.message}</p>
        </div>
      ))}
      </div>

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button style={{marginTop: "14px"}} onClick={sendMessage}>send</button>
      <button style={{marginTop: "14px"}} onClick={displayMessages}>show chat</button>
    </div>
      </div>

  );
}

export default App;
