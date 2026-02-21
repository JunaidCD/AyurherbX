// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HerbalProductNFT {
    mapping(uint256 => ProductData) public products;
    uint256 public nextProductId;
    
    struct ProductData {
        string name;
        string description;
        string origin;
        uint256 harvestDate;
        address owner;
        bool exists;
    }
    
    event ProductMinted(uint256 indexed productId, address indexed owner, string name);
    event ProductTransferred(uint256 indexed productId, address indexed from, address indexed to);
    
    function mintProduct(
        string calldata name,
        string calldata description,
        string calldata origin,
        uint256 harvestDate
    ) external returns (uint256) {
        uint256 productId = nextProductId++;
        products[productId] = ProductData({
            name: name,
            description: description,
            origin: origin,
            harvestDate: harvestDate,
            owner: msg.sender,
            exists: true
        });
        
        emit ProductMinted(productId, msg.sender, name);
        return productId;
    }
    
    function transferProduct(uint256 productId, address to) external {
        require(products[productId].exists, "Product does not exist");
        require(products[productId].owner == msg.sender, "Not the owner");
        
        address from = products[productId].owner;
        products[productId].owner = to;
        
        emit ProductTransferred(productId, from, to);
    }
    
    function getProduct(uint256 productId) external view returns (ProductData memory) {
        return products[productId];
    }
}
