import web3 from "./web3";
   import VotingContract from "../../voting-app/build/contracts/Voting.json";

   let contractInstance;

   try {
     const { abi, networks } = VotingContract;
     const networkId = Object.keys(networks)[0];
     const contractAddress = networks[networkId]?.address;

     if (!contractAddress) {
       throw new Error(`No contract address found for network ID ${networkId}.`);
     }

     contractInstance = new web3.eth.Contract(abi, contractAddress);

     console.log(`Connected to contract at address: ${contractAddress}`);
   } catch (error) {
     console.error("Failed to initialize contract instance:", error);
     alert(`Failed to initialize contract instance: ${error.message}`);
   }

   export default contractInstance;
