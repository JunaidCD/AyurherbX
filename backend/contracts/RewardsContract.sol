// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardsContract
 * @dev Manages farmer rewards, loyalty points, and incentives
 * Tracks contributions, quality scores, and distributes rewards
 */
contract RewardsContract is Ownable {

    // Reward type
    enum RewardType {
        Points,
        Cashback,
        Badge,
        Discount,
        Grant
    }

    // Reward status
    enum RewardStatus {
        Pending,
        Approved,
        Distributed,
        Cancelled
    }

    // Farmer profile
    struct FarmerProfile {
        address farmerAddress;
        string name;
        string location;
        uint256 totalBatchesSubmitted;
        uint256 totalQualityScore;
        uint256 loyaltyPoints;
        uint256 totalEarnings;
        uint256 joinedAt;
        uint256 lastActiveAt;
        Badge[] badges;
        bool isVerified;
    }

    // Badge types
    enum BadgeType {
        None,
        Bronze,
        Silver,
        Gold,
        Platinum,
        Diamond,
        OrganicPioneer,
        QualityMaster,
        SustainabilityChampion
    }

    // Badge structure
    struct Badge {
        BadgeType badgeType;
        string name;
        uint256 earnedAt;
        string description;
    }

    // Reward pool
    struct RewardPool {
        uint256 totalAllocated;
        uint256 totalDistributed;
        uint256 remaining;
        uint256 minQualifyingScore;
    }

    // Individual reward
    struct Reward {
        uint256 id;
        address recipient;
        RewardType rewardType;
        uint256 amount;
        RewardStatus status;
        string description;
        uint256 createdAt;
        uint256 distributedAt;
    }

    // Quality contribution
    struct QualityContribution {
        uint256 batchTokenId;
        uint256 qualityScore;
        uint256 pointsEarned;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => FarmerProfile) public farmerProfiles;
    mapping(address => bool) public registeredFarmers;
    mapping(address => uint256[]) public farmerRewards;
    mapping(address => QualityContribution[]) public farmerContributions;
    mapping(address => mapping(address => bool)) public referrals; // referrer -> referred -> status
    
    mapping(uint256 => Reward) public rewards;
    mapping(RewardType => RewardPool) public rewardPools;
    
    uint256 public nextRewardId = 1;
    uint256 public totalFarmers = 0;

    // Configuration
    uint256 public pointsPerQualityPoint = 10; // 10 points per quality score
    uint256 public referralBonusPoints = 500;
    uint256 public bronzeBadgeThreshold = 1000;
    uint256 public silverBadgeThreshold = 5000;
    uint256 public goldBadgeThreshold = 15000;
    uint256 public platinumBadgeThreshold = 50000;
    uint256 public diamondBadgeThreshold = 100000;

    // Events
    event FarmerRegistered(
        address indexed farmer,
        string name,
        uint256 timestamp
    );

    event QualityScoreRecorded(
        address indexed farmer,
        uint256 batchTokenId,
        uint256 qualityScore,
        uint256 pointsEarned,
        uint256 timestamp
    );

    event PointsEarned(
        address indexed farmer,
        uint256 points,
        string reason,
        uint256 timestamp
    );

    event PointsRedeemed(
        address indexed farmer,
        uint256 points,
        uint256 value,
        uint256 timestamp
    );

    event RewardCreated(
        uint256 indexed rewardId,
        address indexed recipient,
        RewardType rewardType,
        uint256 amount,
        uint256 timestamp
    );

    event RewardDistributed(
        uint256 indexed rewardId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event BadgeEarned(
        address indexed farmer,
        BadgeType badgeType,
        string badgeName,
        uint256 timestamp
    );

    event ReferralMade(
        address indexed referrer,
        address indexed referred,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {
        // Initialize reward pools
        rewardPools[RewardType.Points] = RewardPool({
            totalAllocated: 0,
            totalDistributed: 0,
            remaining: 0,
            minQualifyingScore: 0
        });
    }

    /**
     * @dev Register a new farmer
     */
    function registerFarmer(string memory _name, string memory _location) external {
        require(!registeredFarmers[msg.sender], "Already registered");
        
        farmerProfiles[msg.sender] = FarmerProfile({
            farmerAddress: msg.sender,
            name: _name,
            location: _location,
            totalBatchesSubmitted: 0,
            totalQualityScore: 0,
            loyaltyPoints: 100, // Welcome bonus
            totalEarnings: 0,
            joinedAt: block.timestamp,
            lastActiveAt: block.timestamp,
            badges: new Badge[](0),
            isVerified: false
        });

        registeredFarmers[msg.sender] = true;
        totalFarmers++;

        emit FarmerRegistered(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev Record quality score and award points
     */
    function recordQualityScore(
        uint256 _batchTokenId,
        uint256 _qualityScore,
        address _farmer
    ) external onlyOwner {
        require(registeredFarmers[_farmer], "Farmer not registered");
        
        FarmerProfile storage profile = farmerProfiles[_farmer];
        
        // Calculate points
        uint256 pointsEarned = _qualityScore * pointsPerQualityPoint;
        
        // Record contribution
        farmerContributions[_farmer].push(QualityContribution({
            batchTokenId: _batchTokenId,
            qualityScore: _qualityScore,
            pointsEarned: pointsEarned,
            timestamp: block.timestamp
        }));
        
        // Update profile
        profile.totalBatchesSubmitted++;
        profile.totalQualityScore += _qualityScore;
        profile.loyaltyPoints += pointsEarned;
        profile.lastActiveAt = block.timestamp;
        
        // Check for badge upgrades
        _checkBadgeUpgrade(profile);

        emit QualityScoreRecorded(_farmer, _batchTokenId, _qualityScore, pointsEarned, block.timestamp);
        emit PointsEarned(_farmer, pointsEarned, "Quality score", block.timestamp);
    }

    /**
     * @dev Add referral bonus
     */
    function addReferral(address _referrer, address _referred) external onlyOwner {
        require(registeredFarmers[_referrer], "Referrer not registered");
        require(registeredFarmers[_referred], "Referred not registered");
        require(!referrals[_referrer][_referred], "Already referred");
        
        referrals[_referrer][_referred] = true;
        
        // Award referral bonus
        farmerProfiles[_referrer].loyaltyPoints += referralBonusPoints;
        
        emit ReferralMade(_referrer, _referred, block.timestamp);
        emit PointsEarned(_referrer, referralBonusPoints, "Referral bonus", block.timestamp);
    }

    /**
     * @dev Redeem points for rewards
     */
    function redeemPoints(uint256 _points, uint256 _rewardValue) external {
        FarmerProfile storage profile = farmerProfiles[msg.sender];
        require(profile.loyaltyPoints >= _points, "Insufficient points");
        
        profile.loyaltyPoints -= _points;
        
        // Create reward
        uint256 rewardId = nextRewardId++;
        
        rewards[rewardId] = Reward({
            id: rewardId,
            recipient: msg.sender,
            rewardType: RewardType.Cashback,
            amount: _rewardValue,
            status: RewardStatus.Pending,
            description: "Points redemption",
            createdAt: block.timestamp,
            distributedAt: 0
        });
        
        farmerRewards[msg.sender].push(rewardId);

        emit PointsRedeemed(msg.sender, _points, _rewardValue, block.timestamp);
    }

    /**
     * @dev Create and distribute reward
     */
    function createAndDistributeReward(
        address _recipient,
        RewardType _rewardType,
        uint256 _amount,
        string memory _description
    ) external onlyOwner returns (uint256) {
        uint256 rewardId = nextRewardId++;
        
        rewards[rewardId] = Reward({
            id: rewardId,
            recipient: _recipient,
            rewardType: _rewardType,
            amount: _amount,
            status: RewardStatus.Distributed,
            description: _description,
            createdAt: block.timestamp,
            distributedAt: block.timestamp
        });
        
        farmerRewards[_recipient].push(rewardId);
        
        // Update farmer profile
        if (_rewardType == RewardType.Points) {
            farmerProfiles[_recipient].loyaltyPoints += _amount;
        } else if (_rewardType == RewardType.Cashback || _rewardType == RewardType.Grant) {
            farmerProfiles[_recipient].totalEarnings += _amount;
        }
        
        // Update pool
        rewardPools[_rewardType].totalDistributed += _amount;

        emit RewardCreated(rewardId, _recipient, _rewardType, _amount, block.timestamp);
        emit RewardDistributed(rewardId, _recipient, _amount, block.timestamp);
        
        return rewardId;
    }

    /**
     * @dev Check and upgrade badges
     */
    function _checkBadgeUpgrade(FarmerProfile storage profile) internal {
        uint256 totalPoints = profile.loyaltyPoints;
        BadgeType currentBadge = _getHighestBadge(profile.badges);
        
        BadgeType newBadge = BadgeType.None;
        string memory badgeName = "";
        
        if (totalPoints >= diamondBadgeThreshold && currentBadge < BadgeType.Diamond) {
            newBadge = BadgeType.Diamond;
            badgeName = "Diamond";
        } else if (totalPoints >= platinumBadgeThreshold && currentBadge < BadgeType.Platinum) {
            newBadge = BadgeType.Platinum;
            badgeName = "Platinum";
        } else if (totalPoints >= goldBadgeThreshold && currentBadge < BadgeType.Gold) {
            newBadge = BadgeType.Gold;
            badgeName = "Gold";
        } else if (totalPoints >= silverBadgeThreshold && currentBadge < BadgeType.Silver) {
            newBadge = BadgeType.Silver;
            badgeName = "Silver";
        } else if (totalPoints >= bronzeBadgeThreshold && currentBadge < BadgeType.Bronze) {
            newBadge = BadgeType.Bronze;
            badgeName = "Bronze";
        }
        
        if (newBadge != BadgeType.None) {
            profile.badges.push(Badge({
                badgeType: newBadge,
                name: badgeName,
                earnedAt: block.timestamp,
                description: string(abi.encodePacked(badgeName, " badge earned for loyalty"))
            }));
            
            emit BadgeEarned(profile.farmerAddress, newBadge, badgeName, block.timestamp);
        }
    }

    /**
     * @dev Get highest badge
     */
    function _getHighestBadge(Badge[] storage badges) internal view returns (BadgeType) {
        BadgeType highest = BadgeType.None;
        for (uint256 i = 0; i < badges.length; i++) {
            if (badges[i].badgeType > highest) {
                highest = badges[i].badgeType;
            }
        }
        return highest;
    }

    /**
     * @dev Get farmer profile
     */
    function getFarmerProfile(address _farmer) external view returns (FarmerProfile memory) {
        return farmerProfiles[_farmer];
    }

    /**
     * @dev Get farmer's rewards
     */
    function getFarmerRewards(address _farmer) external view returns (Reward[] memory) {
        uint256[] storage rewardIds = farmerRewards[_farmer];
        Reward[] memory result = new Reward[](rewardIds.length);
        
        for (uint256 i = 0; i < rewardIds.length; i++) {
            result[i] = rewards[rewardIds[i]];
        }
        
        return result;
    }

    /**
     * @dev Get farmer's quality contributions
     */
    function getFarmerContributions(address _farmer) external view returns (QualityContribution[] memory) {
        return farmerContributions[_farmer];
    }

    /**
     * @dev Get reward details
     */
    function getReward(uint256 _rewardId) external view returns (Reward memory) {
        return rewards[_rewardId];
    }

    /**
     * @dev Get average quality score
     */
    function getAverageQualityScore(address _farmer) external view returns (uint256) {
        FarmerProfile storage profile = farmerProfiles[_farmer];
        if (profile.totalBatchesSubmitted == 0) return 0;
        return profile.totalQualityScore / profile.totalBatchesSubmitted;
    }

    /**
     * @dev Get farmer leaderboard position
     */
    function getLeaderboardPosition(address _farmer) external pure returns (uint256 position) {
        // farmerPoints unused - placeholder implementation
        _farmer;
        position = 1;
        
        // This is a simple implementation - in production, use sorted data structure
        return 0; // Simplified - would need full iteration
    }

    /**
     * @dev Verify farmer
     */
    function verifyFarmer(address _farmer) external onlyOwner {
        require(registeredFarmers[_farmer], "Farmer not registered");
        farmerProfiles[_farmer].isVerified = true;
    }

    /**
     * @dev Set points per quality point
     */
    function setPointsPerQualityPoint(uint256 _points) external onlyOwner {
        pointsPerQualityPoint = _points;
    }

    /**
     * @dev Allocate reward pool
     */
    function allocateRewardPool(RewardType _rewardType, uint256 _amount) external onlyOwner {
        rewardPools[_rewardType].totalAllocated += _amount;
        rewardPools[_rewardType].remaining += _amount;
    }
}
