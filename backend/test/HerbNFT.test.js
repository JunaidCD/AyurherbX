const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("HerbNFT - Comprehensive Testing", function () {
  let herbNFT;
  let owner;
  let collector1;
  let collector2;
  let processor;
  let labTester;
  let addrs;

  // Common test data
  const herbName = "Ashwagandha";
  const batchCode = "BAT-2024-001";
  const originLocation = "Rajasthan, India";
  const harvestDate = "2024-01-15";
  const tokenURI = "ipfs://QmTest123/metadata.json";

  beforeEach(async function () {
    [owner, collector1, collector2, processor, labTester, ...addrs] = await ethers.getSigners();
    
    const HerbNFT = await ethers.getContractFactory("HerbNFT");
    herbNFT = await HerbNFT.deploy();
    await herbNFT.waitForDeployment();
  });

  // ============================================
  // DEPLOYMENT TESTS
  // ============================================
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await herbNFT.owner()).to.equal(owner.address);
    });

    it("Should initialize token counter to 1", async function () {
      expect(await herbNFT.getTotalBatches()).to.equal(0);
    });

    it("Should have correct token name and symbol", async function () {
      expect(await herbNFT.name()).to.equal("AyurHerb NFT");
      expect(await herbNFT.symbol()).to.equal("AHNFT");
    });
  });

  // ============================================
  // FULL FLOW TEST: Submit → Verify → Transfer
  // ============================================
  describe("Full Flow: Mint → Verify → Transfer → Process", function () {
    let tokenId;

    it("Should complete full herb batch lifecycle", async function () {
      // Step 1: Collector mints a new herb batch NFT
      await expect(
        herbNFT.connect(collector1).mintHerbBatch(
          herbName,
          batchCode,
          originLocation,
          harvestDate,
          tokenURI
        )
      ).to.emit(herbNFT, "HerbBatchMinted")
        .withArgs(1, collector1.address, herbName, batchCode, anyValue);

      tokenId = 1;
      
      // Verify the batch was created correctly
      const batch = await herbNFT.getHerbBatch(tokenId);
      expect(batch.herbName).to.equal(herbName);
      expect(batch.batchCode).to.equal(batchCode);
      expect(batch.collector).to.equal(collector1.address);
      expect(batch.originLocation).to.equal(originLocation);
      expect(batch.harvestDate).to.equal(harvestDate);
      expect(batch.isVerified).to.equal(false);
      expect(batch.isProcessed).to.equal(false);
      expect(batch.qualityGrade).to.equal("B"); // Default grade

      // Step 2: Owner verifies and assigns quality grade
      await expect(
        herbNFT.connect(owner).verifyHerbBatch(tokenId, "A")
      ).to.emit(herbNFT, "HerbBatchVerified")
        .withArgs(tokenId, owner.address, "A");

      // Verify grade was assigned
      const verifiedBatch = await herbNFT.getHerbBatch(tokenId);
      expect(verifiedBatch.isVerified).to.equal(true);
      expect(verifiedBatch.qualityGrade).to.equal("A");

      // Step 3: Transfer ownership to processor
      await expect(
        herbNFT.connect(collector1).transferFrom(collector1.address, processor.address, tokenId)
      ).to.emit(herbNFT, "Transfer")
        .withArgs(collector1.address, processor.address, tokenId);

      // Verify new owner
      expect(await herbNFT.ownerOf(tokenId)).to.equal(processor.address);

      // Step 4: Processor marks as processed
      await expect(
        herbNFT.connect(processor).markAsProcessed(tokenId)
      ).to.not.be.reverted;

      // Verify processed status
      const processedBatch = await herbNFT.getHerbBatch(tokenId);
      expect(processedBatch.isProcessed).to.equal(true);
    });

    it("Should track total batches correctly", async function () {
      // Mint multiple batches
      await herbNFT.connect(collector1).mintHerbBatch("Ashwagandha", "BAT-001", "Rajasthan", "2024-01-01", tokenURI);
      await herbNFT.connect(collector1).mintHerbBatch("Brahmi", "BAT-002", "Kerala", "2024-01-02", tokenURI);
      await herbNFT.connect(collector2).mintHerbBatch("Turmeric", "BAT-003", "Karnataka", "2024-01-03", tokenURI);

      expect(await herbNFT.getTotalBatches()).to.equal(3);
    });
  });

  // ============================================
  // EDGE CASES: Invalid Inputs
  // ============================================
  describe("Edge Cases: Invalid Inputs", function () {
    it("Should fail with empty herb name", async function () {
      await expect(
        herbNFT.connect(collector1).mintHerbBatch(
          "",
          batchCode,
          originLocation,
          harvestDate,
          tokenURI
        )
      ).to.be.revertedWith("Herb name cannot be empty");
    });

    it("Should fail with empty batch code", async function () {
      await expect(
        herbNFT.connect(collector1).mintHerbBatch(
          herbName,
          "",
          originLocation,
          harvestDate,
          tokenURI
        )
      ).to.be.revertedWith("Batch code cannot be empty");
    });

    it("Should fail with empty origin location", async function () {
      await expect(
        herbNFT.connect(collector1).mintHerbBatch(
          herbName,
          batchCode,
          "",
          harvestDate,
          tokenURI
        )
      ).to.be.revertedWith("Origin location cannot be empty");
    });

    it("Should fail with duplicate batch code", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(collector2).mintHerbBatch(
          "Brahmi",
          batchCode, // Same batch code
          "Kerala",
          "2024-01-02",
          tokenURI
        )
      ).to.be.revertedWith("Batch code already exists");
    });

    it("Should fail to verify non-existent token", async function () {
      await expect(
        herbNFT.connect(owner).verifyHerbBatch(999, "A")
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should fail with invalid quality grade", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "D")
      ).to.be.revertedWith("Invalid quality grade");
    });

    it("Should fail to verify already verified batch", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await herbNFT.connect(owner).verifyHerbBatch(1, "A");

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "B")
      ).to.be.revertedWith("Already verified");
    });

    it("Should fail with invalid humidity value", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(owner).updateEnvironmentalData(1, 29800, 101, 50)
      ).to.be.revertedWith("Humidity must be 0-100");
    });

    it("Should fail to mark non-existent token as processed", async function () {
      await expect(
        herbNFT.connect(collector1).markAsProcessed(999)
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should fail when non-owner tries to mark as processed", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(collector2).markAsProcessed(1)
      ).to.be.revertedWith("Not the owner");
    });
  });

  // ============================================
  // EDGE CASES: Role Revocation Mid-Chain
  // ============================================
  describe("Edge Cases: Ownership & Access Control", function () {
    it("Should fail when non-owner tries to verify", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(collector1).verifyHerbBatch(1, "A")
      ).to.be.revertedWithCustomError(herbNFT, "OwnableUnauthorizedAccount");
    });

    it("Should fail when non-owner tries to update environmental data", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(collector1).updateEnvironmentalData(1, 29800, 65, 50)
      ).to.be.revertedWithCustomError(herbNFT, "OwnableUnauthorizedAccount");
    });

    it("Should handle batch code lookup correctly", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      const batch = await herbNFT.getBatchByCode(batchCode);
      expect(batch.tokenId).to.equal(1);
      expect(batch.herbName).to.equal(herbName);
    });

    it("Should fail for non-existent batch code lookup", async function () {
      await expect(
        herbNFT.getBatchByCode("NON-EXISTENT")
      ).to.be.revertedWith("Batch not found");
    });

    it("Should correctly track ownership transfer", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      // Verify initial owner
      expect(await herbNFT.ownerOf(1)).to.equal(collector1.address);

      // Transfer to collector2
      await herbNFT.connect(collector1).transferFrom(
        collector1.address,
        collector2.address,
        1
      );

      // Verify new owner
      expect(await herbNFT.ownerOf(1)).to.equal(collector2.address);
    });

    it("Should fail transfer from non-owner", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(collector2).transferFrom(
          collector1.address,
          addrs[0].address,
          1
        )
      ).to.be.revertedWithCustomError(herbNFT, "ERC721InsufficientApproval");
    });
  });

  // ============================================
  // ENVIRONMENTAL DATA TESTS
  // ============================================
  describe("Environmental Data", function () {
    it("Should update environmental data correctly", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      // Update environmental data (temperature in Kelvin x100, humidity %, AQI)
      await herbNFT.connect(owner).updateEnvironmentalData(
        1,  // tokenId
        29815,  // 298.15K (25°C)
        65,     // 65% humidity
        42      // AQI
      );

      const batch = await herbNFT.getHerbBatch(1);
      expect(batch.environmentalData.temperature).to.equal(29815);
      expect(batch.environmentalData.humidity).to.equal(65);
      expect(batch.environmentalData.airQualityIndex).to.equal(42);
      expect(batch.environmentalData.lastUpdated).to.be.gt(0);
    });

    it("Should emit EnvironmentalDataUpdated event", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(owner).updateEnvironmentalData(1, 29815, 65, 42)
      ).to.emit(herbNFT, "EnvironmentalDataUpdated")
        .withArgs(1, 29815, 65, anyValue);
    });
  });

  // ============================================
  // ERC721 STANDARD TESTS
  // ============================================
  describe("ERC721 Standard Compliance", function () {
    it("Should support ERC721 interfaces", async function () {
      expect(await herbNFT.supportsInterface("0x80ac58cd")).to.equal(true); // ERC721
      expect(await herbNFT.supportsInterface("0x5b5e139f")).to.equal(true); // ERC721Metadata
      expect(await herbNFT.supportsInterface("0x01ffc9a7")).to.equal(true); // ERC165
    });

    it("Should set and return token URI", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      expect(await herbNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should correctly return balanceOf", async function () {
      expect(await herbNFT.balanceOf(collector1.address)).to.equal(0);

      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      expect(await herbNFT.balanceOf(collector1.address)).to.equal(1);

      // Mint another
      await herbNFT.connect(collector1).mintHerbBatch(
        "Brahmi",
        "BAT-002",
        "Kerala",
        "2024-01-02",
        "ipfs://QmTest/metadata2.json"
      );

      expect(await herbNFT.balanceOf(collector1.address)).to.equal(2);
    });

    it("Should fail balanceOf for zero address", async function () {
      await expect(
        herbNFT.balanceOf(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(herbNFT, "ERC721InvalidOwner");
    });

    it("Should correctly use safeTransferFrom", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await herbNFT.connect(collector1)["safeTransferFrom(address,address,uint256)"](
        collector1.address,
        collector2.address,
        1
      );

      expect(await herbNFT.ownerOf(1)).to.equal(collector2.address);
    });
  });

  // ============================================
  // BATCH LOOKUP TESTS
  // ============================================
  describe("Batch Lookup & Retrieval", function () {
    beforeEach(async function () {
      // Create multiple batches
      await herbNFT.connect(collector1).mintHerbBatch(
        "Ashwagandha",
        "BAT-001",
        "Rajasthan",
        "2024-01-01",
        "ipfs://Qm1"
      );
      
      await herbNFT.connect(collector1).mintHerbBatch(
        "Brahmi",
        "BAT-002",
        "Kerala",
        "2024-01-02",
        "ipfs://Qm2"
      );

      await herbNFT.connect(collector2).mintHerbBatch(
        "Turmeric",
        "BAT-003",
        "Karnataka",
        "2024-01-03",
        "ipfs://Qm3"
      );
    });

    it("Should get all batch data correctly", async function () {
      const batch = await herbNFT.getHerbBatch(1);
      expect(batch.herbName).to.equal("Ashwagandha");
      expect(batch.tokenId).to.equal(1);
    });

    it("Should get batch by code correctly", async function () {
      const batch = await herbNFT.getBatchByCode("BAT-002");
      expect(batch.herbName).to.equal("Brahmi");
    });

    it("Should return correct total batches", async function () {
      expect(await herbNFT.getTotalBatches()).to.equal(3);
    });
  });

  // ============================================
  // QUALITY GRADING SYSTEM TESTS
  // ============================================
  describe("Quality Grading System", function () {
    it("Should assign default grade B on mint", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      const batch = await herbNFT.getHerbBatch(1);
      expect(batch.qualityGrade).to.equal("B");
      expect(batch.isVerified).to.equal(false);
    });

    it("Should allow all valid grades A, B, C", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(herbName, "BAT-001", originLocation, harvestDate, tokenURI);
      await herbNFT.connect(collector1).mintHerbBatch(herbName, "BAT-002", originLocation, harvestDate, tokenURI);
      await herbNFT.connect(collector1).mintHerbBatch(herbName, "BAT-003", originLocation, harvestDate, tokenURI);

      await herbNFT.connect(owner).verifyHerbBatch(1, "A");
      await herbNFT.connect(owner).verifyHerbBatch(2, "B");
      await herbNFT.connect(owner).verifyHerbBatch(3, "C");

      expect((await herbNFT.getHerbBatch(1)).qualityGrade).to.equal("A");
      expect((await herbNFT.getHerbBatch(2)).qualityGrade).to.equal("B");
      expect((await herbNFT.getHerbBatch(3)).qualityGrade).to.equal("C");
    });

    it("Should reject invalid grade strings", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        herbName,
        batchCode,
        originLocation,
        harvestDate,
        tokenURI
      );

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "Premium")
      ).to.be.revertedWith("Invalid quality grade");

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "AA")
      ).to.be.revertedWith("Invalid quality grade");

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "1")
      ).to.be.revertedWith("Invalid quality grade");
    });
  });
});

describe("ChainlinkOracleStub - Testing", function () {
  let oracle;

  beforeEach(async function () {
    const Oracle = await ethers.getContractFactory("ChainlinkOracleStub");
    oracle = await Oracle.deploy();
    await oracle.waitForDeployment();
  });

  describe("Oracle Functionality", function () {
    it("Should request environmental data", async function () {
      await expect(oracle.requestEnvironmentalData("temperature"))
        .to.emit(oracle, "DataRequested")
        .withArgs(anyValue, "temperature", (await ethers.getSigners())[0].address);
    });

    it("Should fulfill data request", async function () {
      const tx = await oracle.requestEnvironmentalData("test");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args[0];
      
      await expect(
        oracle.fulfillRequest(requestId, 29815, 65, 42)
      ).to.emit(oracle, "DataFulfilled")
        .withArgs(requestId, 29815, 65, anyValue);

      const data = await oracle.getLatestData();
      expect(data.temperature).to.equal(29815);
      expect(data.humidity).to.equal(65);
      expect(data.airQualityIndex).to.equal(42);
    });

    it("Should fail double fulfillment", async function () {
      const tx = await oracle.requestEnvironmentalData("test");
      const receipt = await tx.wait();
      const requestId = receipt.logs[0].args[0];
      
      await oracle.fulfillRequest(requestId, 29815, 65, 42);

      await expect(
        oracle.fulfillRequest(requestId, 30000, 70, 50)
      ).to.be.revertedWith("Request already fulfilled");
    });

    it("Should update data stub", async function () {
      await oracle.updateDataStub(30000, 75, 50);

      const data = await oracle.getLatestData();
      expect(data.temperature).to.equal(30000);
      expect(data.humidity).to.equal(75);
      expect(data.airQualityIndex).to.equal(50);
    });
  });
});

describe("HerbNFT - Pausable Functionality", function () {
  let herbNFT;
  let owner;
  let collector1;

  beforeEach(async function () {
    [owner, collector1] = await ethers.getSigners();
    
    const HerbNFT = await ethers.getContractFactory("HerbNFT");
    herbNFT = await HerbNFT.deploy();
    await herbNFT.waitForDeployment();
  });

  describe("Pause/Unpause", function () {
    it("Should pause the contract", async function () {
      await expect(herbNFT.connect(owner).pause())
        .to.emit(herbNFT, "Paused")
        .withArgs(owner.address);
    });

    it("Should unpause the contract", async function () {
      await herbNFT.connect(owner).pause();
      
      await expect(herbNFT.connect(owner).unpause())
        .to.emit(herbNFT, "Unpaused")
        .withArgs(owner.address);
    });

    it("Should prevent minting when paused", async function () {
      await herbNFT.connect(owner).pause();

      await expect(
        herbNFT.connect(collector1).mintHerbBatch(
          "Ashwagandha",
          "BAT-001",
          "Rajasthan",
          "2024-01-01",
          "ipfs://QmTest"
        )
      ).to.be.revertedWithCustomError(herbNFT, "EnforcedPause");
    });

    it("Should prevent verification when paused", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        "Ashwagandha",
        "BAT-001",
        "Rajasthan",
        "2024-01-01",
        "ipfs://QmTest"
      );
      
      await herbNFT.connect(owner).pause();

      await expect(
        herbNFT.connect(owner).verifyHerbBatch(1, "A")
      ).to.be.revertedWithCustomError(herbNFT, "EnforcedPause");
    });

    it("Should prevent processing when paused", async function () {
      await herbNFT.connect(collector1).mintHerbBatch(
        "Ashwagandha",
        "BAT-001",
        "Rajasthan",
        "2024-01-01",
        "ipfs://QmTest"
      );
      
      await herbNFT.connect(owner).pause();

      await expect(
        herbNFT.connect(collector1).markAsProcessed(1)
      ).to.be.revertedWithCustomError(herbNFT, "EnforcedPause");
    });

    it("Should fail pause from non-owner", async function () {
      await expect(
        herbNFT.connect(collector1).pause()
      ).to.be.revertedWithCustomError(herbNFT, "OwnableUnauthorizedAccount");
    });
  });
});
