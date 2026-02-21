// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WholesaleMarketplace {
    struct Listing {
        bytes32 listingId;
        address seller;
        bytes32 batchId;
        uint256 pricePerUnit;
        uint256 availableQuantity;
        bool active;
    }
    
    mapping(bytes32 => Listing) public listings;
    bytes32[] public listingIds;
    
    event ListingCreated(bytes32 indexed listingId, address indexed seller);
    event ListingSold(bytes32 indexed listingId, address indexed buyer, uint256 quantity);
    
    function createListing(
        bytes32 listingId,
        bytes32 batchId,
        uint256 pricePerUnit,
        uint256 quantity
    ) external {
        require(listings[listingId].seller == address(0), "Listing exists");
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            batchId: batchId,
            pricePerUnit: pricePerUnit,
            availableQuantity: quantity,
            active: true
        });
        listingIds.push(listingId);
        
        emit ListingCreated(listingId, msg.sender);
    }
    
    function purchaseListing(bytes32 listingId, uint256 quantity) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Not active");
        require(listing.availableQuantity >= quantity, "Insufficient quantity");
        
        uint256 totalCost = listing.pricePerUnit * quantity;
        require(msg.value >= totalCost, "Insufficient payment");
        
        listing.availableQuantity -= quantity;
        if (listing.availableQuantity == 0) {
            listing.active = false;
        }
        
        emit ListingSold(listingId, msg.sender, quantity);
    }
}
