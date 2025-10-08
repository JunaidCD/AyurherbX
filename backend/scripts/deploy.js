const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying HerbCollection contract to Sepolia testnet...");

  // Get the ContractFactory and Signers here
  const HerbCollection = await hre.ethers.getContractFactory("HerbCollection");
  
  // Deploy the contract
  const herbCollection = await HerbCollection.deploy();
  await herbCollection.waitForDeployment();

  const contractAddress = await herbCollection.getAddress();
  console.log("HerbCollection deployed to:", contractAddress);

  // Save the contract address and ABI to a JSON file
  const contractInfo = {
    address: contractAddress,
    abi: HerbCollection.interface.formatJson(),
    network: "sepolia",
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
    if (envContent.includes("COLLECTION_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /COLLECTION_CONTRACT_ADDRESS=.*/,
        `COLLECTION_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nCOLLECTION_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with contract address");
  }

  // Verify contract on Etherscan (optional)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await herbCollection.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
