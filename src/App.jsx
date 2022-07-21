import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import "./App.css";

export default function App() {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x925bA447a2d448a29e15922461cB990B8310b6Cd";
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

  const wave = async () => {
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

        const waveTxn = await wavePortalContract.wave();
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
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}
