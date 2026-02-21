// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketplaceContract
 * @dev Marketplace for trading herb batch NFTs
 * Supports listing, purchasing, bidding, and offers
 */
contract MarketplaceContract is Ownable {

    // Listing status
    enum ListingStatus {
        Active,
        Sold,
        Cancelled,
        Expired
    }

    // Listing structure
    struct Listing {
        uint256 id;
        uint256 batchTokenId;
        address seller;
        address buyer;
        uint256 price; // Price in wei
        ListingStatus status;
        uint256 listedAt;
        uint256 expiresAt;
        string currency; // e.g., "ETH", "USDC"
    }

    // Offer structure
    struct Offer {
        uint256 id;
        uint256 listingId;
        address offerer;
        uint256 price;
        uint256 expiresAt;
        bool accepted;
        bool rejected;
    }

    // Bid structure for auctions
    struct Auction {
        uint256 id;
        uint256 batchTokenId;
        address seller;
        address highestBidder;
        uint256 highestBid;
        uint256 startingPrice;
        uint256 startTime;
        uint256 endTime;
        bool ended;
        address winner;
    }

    // Platform fee
    uint256 public platformFeePercent = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer[]) public listingOffers;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256[]) public userListings;
    mapping(address => uint256[]) public userAuctions;
    mapping(address => uint256[]) public userPurchases;

    uint256 public nextListingId = 1;
    uint256 public nextAuctionId = 1;

    // Events
    event Listed(
        uint256 indexed listingId,
        uint256 indexed batchTokenId,
        address seller,
        uint256 price,
        uint256 expiresAt,
        uint256 timestamp
    );

    event Sold(
        uint256 indexed listingId,
        uint256 indexed batchTokenId,
        address seller,
        address buyer,
        uint256 price,
        uint256 timestamp
    );

    event Cancelled(
        uint256 indexed listingId,
        address canceller,
        uint256 timestamp
    );

    event OfferMade(
        uint256 indexed offerId,
        uint256 indexed listingId,
        address offerer,
        uint256 price,
        uint256 timestamp
    );

    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed listingId,
        uint256 timestamp
    );

    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed batchTokenId,
        address seller,
        uint256 startingPrice,
        uint256 endTime,
        uint256 timestamp
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address bidder,
        uint256 bidAmount,
        uint256 timestamp
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        address winner,
        uint256 winningBid,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev List a batch NFT for sale
     */
    function listBatch(
        uint256 _batchTokenId,
        uint256 _price,
        uint256 _durationDays,
        string memory _currency
    ) external returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        
        uint256 listingId = nextListingId++;
        
        listings[listingId] = Listing({
            id: listingId,
            batchTokenId: _batchTokenId,
            seller: msg.sender,
            buyer: address(0),
            price: _price,
            status: ListingStatus.Active,
            listedAt: block.timestamp,
            expiresAt: block.timestamp + (_durationDays * 1 days),
            currency: _currency
        });

        userListings[msg.sender].push(listingId);

        emit Listed(
            listingId,
            _batchTokenId,
            msg.sender,
            _price,
            listings[listingId].expiresAt,
            block.timestamp
        );

        return listingId;
    }

    /**
     * @dev Purchase a listed batch
     */
    function purchaseBatch(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.status == ListingStatus.Active, "Listing not active");
        require(block.timestamp <= listing.expiresAt, "Listing expired");
        require(msg.sender != listing.seller, "Cannot buy own listing");
        
        uint256 price = listing.price;
        require(msg.value >= price, "Insufficient payment");

        // Calculate fees
        uint256 platformFee = (price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - platformFee;

        // Transfer NFT (in production, use safeTransferFrom)
        // Transfer payments
        payable(listing.seller).transfer(sellerAmount);
        
        // Update listing
        listing.status = ListingStatus.Sold;
        listing.buyer = msg.sender;
        
        userPurchases[msg.sender].push(listing.batchTokenId);

        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit Sold(
            _listingId,
            listing.batchTokenId,
            listing.seller,
            msg.sender,
            price,
            block.timestamp
        );
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.status == ListingStatus.Active, "Listing not active");
        
        listing.status = ListingStatus.Cancelled;

        emit Cancelled(_listingId, msg.sender, block.timestamp);
    }

    /**
     * @dev Make an offer on a listing
     */
    function makeOffer(
        uint256 _listingId,
        uint256 _price,
        uint256 _durationDays
    ) external {
        Listing storage listing = listings[_listingId];
        require(listing.status == ListingStatus.Active, "Listing not active");
        require(msg.sender != listing.seller, "Cannot offer on own listing");
        
        listingOffers[_listingId].push(Offer({
            id: listingOffers[_listingId].length + 1,
            listingId: _listingId,
            offerer: msg.sender,
            price: _price,
            expiresAt: block.timestamp + (_durationDays * 1 days),
            accepted: false,
            rejected: false
        }));

        emit OfferMade(
            listingOffers[_listingId].length,
            _listingId,
            msg.sender,
            _price,
            block.timestamp
        );
    }

    /**
     * @dev Accept an offer
     */
    function acceptOffer(uint256 _listingId, uint256 _offerIndex) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Not the seller");
        
        Offer storage offer = listingOffers[_listingId][_offerIndex];
        require(!offer.accepted && !offer.rejected, "Offer already processed");
        require(block.timestamp <= offer.expiresAt, "Offer expired");
        
        uint256 price = offer.price;
        require(msg.value >= price, "Insufficient payment");

        // Calculate fees
        uint256 platformFee = (price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - platformFee;

        // Transfer payments
        payable(listing.seller).transfer(sellerAmount);
        
        // Update listing
        listing.status = ListingStatus.Sold;
        listing.buyer = offer.offerer;
        
        // Mark offer accepted
        offer.accepted = true;

        emit OfferAccepted(_offerIndex, _listingId, block.timestamp);
        emit Sold(_listingId, listing.batchTokenId, listing.seller, offer.offerer, price, block.timestamp);
    }

    /**
     * @dev Create an auction
     */
    function createAuction(
        uint256 _batchTokenId,
        uint256 _startingPrice,
        uint256 _durationDays
    ) external returns (uint256) {
        require(_startingPrice > 0, "Starting price must be greater than 0");
        
        uint256 auctionId = nextAuctionId++;
        
        auctions[auctionId] = Auction({
            id: auctionId,
            batchTokenId: _batchTokenId,
            seller: msg.sender,
            highestBidder: address(0),
            highestBid: _startingPrice,
            startingPrice: _startingPrice,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationDays * 1 days),
            ended: false,
            winner: address(0)
        });

        userAuctions[msg.sender].push(auctionId);

        emit AuctionCreated(
            auctionId,
            _batchTokenId,
            msg.sender,
            _startingPrice,
            auctions[auctionId].endTime,
            block.timestamp
        );

        return auctionId;
    }

    /**
     * @dev Place a bid on an auction
     */
    function placeBid(uint256 _auctionId) external payable {
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp <= auction.endTime, "Auction expired");
        require(msg.value > auction.highestBid, "Bid too low");
        require(msg.sender != auction.seller, "Cannot bid on own auction");
        
        // Return previous highest bid
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit BidPlaced(_auctionId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev End an auction
     */
    function endAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended, "Already ended");
        require(block.timestamp > auction.endTime, "Auction not ended");
        
        // Calculate fees
        uint256 platformFee = (auction.highestBid * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = auction.highestBid - platformFee;

        // Transfer payment to seller
        payable(auction.seller).transfer(sellerAmount);
        
        auction.ended = true;
        auction.winner = auction.highestBidder;

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid, block.timestamp);
    }

    /**
     * @dev Set platform fee
     */
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = _feePercent;
    }

    /**
     * @dev Get listing details
     */
    function getListing(uint256 _listingId) external view returns (Listing memory) {
        return listings[_listingId];
    }

    /**
     * @dev Get auction details
     */
    function getAuction(uint256 _auctionId) external view returns (Auction memory) {
        return auctions[_auctionId];
    }

    /**
     * @dev Get offers for a listing
     */
    function getListingOffers(uint256 _listingId) external view returns (Offer[] memory) {
        return listingOffers[_listingId];
    }

    /**
     * @dev Get user's listings
     */
    function getUserListings(address _user) external view returns (uint256[] memory) {
        return userListings[_user];
    }

    /**
     * @dev Get user's auctions
     */
    function getUserAuctions(address _user) external view returns (uint256[] memory) {
        return userAuctions[_user];
    }

    /**
     * @dev Get user's purchases
     */
    function getUserPurchases(address _user) external view returns (uint256[] memory) {
        return userPurchases[_user];
    }

    /**
     * @dev Get active listings count
     */
    function getActiveListingsCount() external view returns (uint256 count) {
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].status == ListingStatus.Active) {
                count++;
            }
        }
    }
}
