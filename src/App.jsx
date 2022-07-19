import React, { useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const checkIfWalletConnected =() => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask!")
    } else {
      console.log("We have ethereum object", ethereum)
    }
  }
  
  const wave = () => {
    
  }

  useEffect(() => {
    checkIfWalletConnected()
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
