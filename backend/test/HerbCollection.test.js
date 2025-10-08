const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HerbCollection", function () {
  let herbCollection;
  let owner;
  let collector1;
  let collector2;

  beforeEach(async function () {
    [owner, collector1, collector2] = await ethers.getSigners();
    
    const HerbCollection = await ethers.getContractFactory("HerbCollection");
    herbCollection = await HerbCollection.deploy();
    await herbCollection.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await herbCollection.owner()).to.equal(owner.address);
    });

    it("Should initialize nextCollectionId to 1", async function () {
      expect(await herbCollection.nextCollectionId()).to.equal(1);
    });
  });

  describe("Collection Submission", function () {
    it("Should submit a collection successfully", async function () {
      const herbName = "Ashwagandha";
      const quantity = "25kg";
      const batchId = "BAT-2024-001";
      const location = "Kerala, India";
      const notes = "High quality organic herbs";

      await expect(
        herbCollection.connect(collector1).submitCollection(
          herbName,
          quantity,
          batchId,
          location,
          notes
        )
      ).to.emit(herbCollection, "CollectionSubmitted")
       .withArgs(1, collector1.address, herbName, batchId, anyValue);

      const collection = await herbCollection.getCollection(1);
      expect(collection.herbName).to.equal(herbName);
      expect(collection.quantity).to.equal(quantity);
      expect(collection.batchId).to.equal(batchId);
      expect(collection.collector).to.equal(collector1.address);
      expect(collection.location).to.equal(location);
      expect(collection.notes).to.equal(notes);
      expect(collection.isVerified).to.equal(false);
    });

    it("Should fail with empty herb name", async function () {
      await expect(
        herbCollection.connect(collector1).submitCollection(
          "",
          "25kg",
          "BAT-2024-001",
          "Kerala, India",
          "Notes"
        )
      ).to.be.revertedWith("Herb name cannot be empty");
    });

    it("Should fail with empty quantity", async function () {
      await expect(
        herbCollection.connect(collector1).submitCollection(
          "Ashwagandha",
          "",
          "BAT-2024-001",
          "Kerala, India",
          "Notes"
        )
      ).to.be.revertedWith("Quantity cannot be empty");
    });

    it("Should increment collection ID", async function () {
      await herbCollection.connect(collector1).submitCollection(
        "Ashwagandha",
        "25kg",
        "BAT-2024-001",
        "Kerala, India",
        "Notes"
      );

      await herbCollection.connect(collector2).submitCollection(
        "Brahmi",
        "15kg",
        "BAT-2024-002",
        "Tamil Nadu, India",
        "Fresh harvest"
      );

      expect(await herbCollection.nextCollectionId()).to.equal(3);
    });
  });

  describe("Collection Retrieval", function () {
    beforeEach(async function () {
      await herbCollection.connect(collector1).submitCollection(
        "Ashwagandha",
        "25kg",
        "BAT-2024-001",
        "Kerala, India",
        "Notes 1"
      );

      await herbCollection.connect(collector1).submitCollection(
        "Brahmi",
        "15kg",
        "BAT-2024-002",
        "Tamil Nadu, India",
        "Notes 2"
      );

      await herbCollection.connect(collector2).submitCollection(
        "Turmeric",
        "30kg",
        "BAT-2024-003",
        "Karnataka, India",
        "Notes 3"
      );
    });

    it("Should get collection by ID", async function () {
      const collection = await herbCollection.getCollection(1);
      expect(collection.herbName).to.equal("Ashwagandha");
      expect(collection.collector).to.equal(collector1.address);
    });

    it("Should get collector collections", async function () {
      const collector1Collections = await herbCollection.getCollectorCollections(collector1.address);
      expect(collector1Collections.length).to.equal(2);
      expect(collector1Collections[0]).to.equal(1);
      expect(collector1Collections[1]).to.equal(2);

      const collector2Collections = await herbCollection.getCollectorCollections(collector2.address);
      expect(collector2Collections.length).to.equal(1);
      expect(collector2Collections[0]).to.equal(3);
    });

    it("Should get all collections", async function () {
      const allCollections = await herbCollection.getAllCollections();
      expect(allCollections.length).to.equal(3);
      expect(allCollections[0].herbName).to.equal("Ashwagandha");
      expect(allCollections[1].herbName).to.equal("Brahmi");
      expect(allCollections[2].herbName).to.equal("Turmeric");
    });

    it("Should get total collections count", async function () {
      expect(await herbCollection.getTotalCollections()).to.equal(3);
    });
  });

  describe("Collection Verification", function () {
    beforeEach(async function () {
      await herbCollection.connect(collector1).submitCollection(
        "Ashwagandha",
        "25kg",
        "BAT-2024-001",
        "Kerala, India",
        "Notes"
      );
    });

    it("Should verify collection by owner", async function () {
      await expect(
        herbCollection.connect(owner).verifyCollection(1)
      ).to.emit(herbCollection, "CollectionVerified")
       .withArgs(1, owner.address);

      const collection = await herbCollection.getCollection(1);
      expect(collection.isVerified).to.equal(true);
    });

    it("Should fail verification by non-owner", async function () {
      await expect(
        herbCollection.connect(collector1).verifyCollection(1)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should fail to verify already verified collection", async function () {
      await herbCollection.connect(owner).verifyCollection(1);
      
      await expect(
        herbCollection.connect(owner).verifyCollection(1)
      ).to.be.revertedWith("Collection already verified");
    });

    it("Should fail to verify non-existent collection", async function () {
      await expect(
        herbCollection.connect(owner).verifyCollection(999)
      ).to.be.revertedWith("Collection does not exist");
    });
  });

  describe("Access Control", function () {
    it("Should update owner", async function () {
      await herbCollection.connect(owner).updateOwner(collector1.address);
      expect(await herbCollection.owner()).to.equal(collector1.address);
    });

    it("Should fail to update owner by non-owner", async function () {
      await expect(
        herbCollection.connect(collector1).updateOwner(collector2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should fail to set zero address as owner", async function () {
      await expect(
        herbCollection.connect(owner).updateOwner(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });
  });
});

// Helper function for testing events with timestamp
const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
