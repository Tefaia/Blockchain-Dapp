// ShippingStatus.sol
// Smart contract for tracking the shipping status of products with PoW and ERC-20 token

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ProofOfWork.sol";

contract ShippingStatus is ERC20, ProofOfWork {
    enum Status { Pending, Shipped, Delivered }

    struct Shipment {
        address buyer;
        address seller;
        Status status;
    }

    mapping(uint256 => Shipment) public shipments;
    uint256 public shipmentCounter;

    event ShipmentUpdated(uint256 indexed shipmentId, Status status);

    constructor() ERC20("ShippingToken", "SPT") {
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint initial tokens
    }

    function createShipment(address _buyer, address _seller) public {
        shipmentCounter++;
        shipments[shipmentCounter] = Shipment(_buyer, _seller, Status.Pending);
    }

    function updateShipmentStatus(uint256 shipmentId, Status status) public {
        Shipment storage shipment = shipments[shipmentId];
        require(msg.sender == shipment.buyer || msg.sender == shipment.seller, "Not authorized");
        require(shipment.status < status, "Invalid status update");

        shipment.status = status;
        _mint(msg.sender, 1); // Mint ERC-20 token as a reward for updating the shipment status
        emit ShipmentUpdated(shipmentId, status);
    }
}
