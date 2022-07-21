import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import "./App.css";

export default function App() {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const [allWaves, setAllWaves] = useState([]);

  const [userMessage, setUserMessage] = useState("");

  const contractAddress = "0xe100F6E731B35911c900302f7140312d029AFF29";
  const contractAbi = abi.abi;

  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!");
      } else {
        console.log("We have ethereum object", ethereum);
      }

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];

        console.log("Authorized account: ", account);

        setCurrentAccount(account);
      } else {
        console.log("No authorized accounts found!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install Metamask extension for your browser!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];

        for (const wave of waves) {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp.toNumber() * 1000),
            message: wave.message,
          });
        }

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const wave = async (msg) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        console.log("User message: ", msg);

        const waveTxn = await wavePortalContract.wave(msg, {
          gasLimit: 300000,
        });
        console.log("Mining ", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
    getAllWaves();

    // listen to events
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("New Wave", from, timestamp, message);

      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: timestamp,
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am rasoskin and I worked on some strange shit omg right? Connect
          your Ethereum wallet and wave at me biatch!
        </div>

        <input
          type="text"
          className="inputText"
          placeholder="Type your message here"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />

        <button className="waveButton" onClick={() => wave(userMessage || "test msg" )}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="waveInfo">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
