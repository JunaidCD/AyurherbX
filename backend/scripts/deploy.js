const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  
  console.log(`Deploying HerbCollection contract to ${networkName} testnet...`);
  console.log(`Chain ID: ${chainId}`);

  // Get the ContractFactory and Signers here
  const HerbCollection = await hre.ethers.getContractFactory("HerbCollection");
  
  // Deploy the contract
  const herbCollection = await HerbCollection.deploy();
  await herbCollection.waitForDeployment();

  const contractAddress = await herbCollection.getAddress();
  console.log("HerbCollection deployed to:", contractAddress);

  // Determine explorer based on network
  let explorerUrl = "";
  let explorerName = "";
  switch (networkName) {
    case "amoy":
      explorerUrl = "https://amoy.polygonscan.com";
      explorerName = "Polygonscan";
      break;
    case "polygon":
      explorerUrl = "https://polygonscan.com";
      explorerName = "Polygonscan";
      break;
    case "sepolia":
      explorerUrl = "https://sepolia.etherscan.io";
      explorerName = "Etherscan";
      break;
    default:
      explorerUrl = "https://etherscan.io";
      explorerName = "Etherscan";
  }

  // Save the contract address and ABI to a JSON file
  const contractInfo = {
    address: contractAddress,
    abi: HerbCollection.interface.formatJson(),
    network: networkName,
    chainId: chainId,
    explorerUrl: explorerUrl,
    deployedAt: new Date().toISOString()
  };

  // Create the contract info directory if it doesn't exist
  const contractsDir = path.join(__dirname, "..", "contracts-info");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Write contract info to file
  fs.writeFileSync(
    path.join(contractsDir, "HerbCollection.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to contracts-info/HerbCollection.json");

  // Update .env file with contract address
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Update COLLECTION_CONTRACT_ADDRESS
    if (envContent.includes("COLLECTION_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /COLLECTION_CONTRACT_ADDRESS=.*/,
        `COLLECTION_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nCOLLECTION_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    // Update NETWORK name
    if (envContent.includes("NETWORK=")) {
      envContent = envContent.replace(
        /NETWORK=.*/,
        `NETWORK=${networkName}`
      );
    } else {
      envContent += `NETWORK=${networkName}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with contract address");
  }

  // Verify contract on block explorer (Etherscan or Polygonscan)
  const isAmoy = networkName === "amoy" || networkName === "polygon";
  const apiKey = isAmoy ? process.env.POLYGONSCAN_API_KEY : process.env.ETHERSCAN_API_KEY;
  
  if (apiKey) {
    console.log(`Waiting for block confirmations on ${networkName}...`);
    await herbCollection.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log(`Contract verified on ${explorerName}`);
      console.log(`View contract at: ${explorerUrl}/address/${contractAddress}`);
    } catch (error) {
      console.log("Verification failed:", error.message);
      console.log(`You can verify manually using: npx hardhat verify --network ${networkName} ${contractAddress}`);
    }
  } else {
    console.log(`No ${isAmoy ? "Polygonscan" : "Etherscan"} API key found. Skipping verification.`);
    console.log(`To verify manually, run: npx hardhat verify --network ${networkName} ${contractAddress}`);
  }

  console.log("\n=== Deployment Summary ===");
  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer: ${explorerUrl}/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
