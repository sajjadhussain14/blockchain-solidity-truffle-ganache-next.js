import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:8545" // Use 8545 for Ganache CLI, 7545 for UI
  );
  web3 = new Web3(provider);
}

export default web3;