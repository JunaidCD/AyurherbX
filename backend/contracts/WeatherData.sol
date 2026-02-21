// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WeatherData
 * @dev Weather condition tracking
 */
contract WeatherData {
    struct Weather {
        int256 temperature;
        uint256 humidity;
        uint256 rainfall;
        uint256 timestamp;
    }

    mapping(address => Weather[]) public weatherData;

    function recordWeather(int256 _temp, uint256 _humidity, uint256 _rainfall) external {
        weatherData[msg.sender].push(Weather({
            temperature: _temp,
            humidity: _humidity,
            rainfall: _rainfall,
            timestamp: block.timestamp
        }));
    }
}
