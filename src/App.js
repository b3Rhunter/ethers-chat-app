import React from "react";
import { useState } from "react";
import './App.css';
import { ethers } from "ethers";
import chatABI from './chatABI.json';

const CHAT_CONTRACT_ADDRESS = "0x85ecbF67C84171E87E78c1e6E77FF1288aeD3D49";

function App() {

  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("please sign in");
  const [chatContract, setChatContract] = useState(null);
  const [signer, setSigner] = useState(null)

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const connect = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      await signer.signMessage("Welcome to React With Ethereum!");
      const contract = new ethers.Contract(CHAT_CONTRACT_ADDRESS, chatABI, signer);
      const messages = await contract.getMessages();
      setMessages(messages);
      const { ethereum } = window;
      if (ethereum) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const displayAddress = address?.substr(0, 6) + "...";
        const ens = await ensProvider.lookupAddress(address);
        if (ens !== null) {
          setName("welcome back..." + ens)
        } else {
          setName("welcome back..." + displayAddress)
        }
      } else {
        alert('no wallet detected!')
      }
      setConnected(true)
      setChatContract(contract)
      setSigner(signer)
    } catch (error) {
      alert(error.message)
    }
  }

  const disconnect = async () => {
    setConnected(false)
    setName("please sign in")
    setMessages([])
  }


  function handleMessageEvent(sender, message) {
    setMessages((messages) => [...messages, { sender, message }]);
  }

  async function sendMessage() {
    await chatContract.sendMessage(currentMessage);
    chatContract.on("NewMessage", handleMessageEvent);
    const messages = await chatContract.getMessages();
    setMessages(messages);
    setCurrentMessage("");
  }

  async function displayMessages() {
    const messages = await chatContract.getMessages();
    setMessages(messages);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ETH-CHAT</h1>
        <h3 className="user-name">{name}</h3>

        {!connected && (
          <button className="connect-button" onClick={connect}>Connect</button>
        )}

        {connected && (
          <>
          <button className="disconnect-button" onClick={disconnect}>
            Disconnect
            </button>
            <div className="message-container example">
            {messages.slice().reverse().map((message, i) => (
              <div key={i} className="message-box">
                <div>
                  <p className="message-sender">From: {message.sender.substr(0, 6) + "..."}</p>
                </div>
                <div>
                  <p className="message-text">{message.message}</p>
                </div>
              </div>
            ))}
          </div><div className="input-container">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)} />

              <button className="send-button" onClick={sendMessage}>Send</button>
            </div></>
        )}

      </header>
    </div>
  );
}

export default App;
