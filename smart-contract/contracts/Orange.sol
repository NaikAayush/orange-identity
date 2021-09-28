// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Orange {
    struct FlightData {
        string flightNo;
        string date;
    }

    struct CustomerData {
        bool isValid;
        string name;
        string passportNumber;
        string faceData;
        FlightData[] flights;
    }
    mapping(string => CustomerData) customerStore;
    string[] customers;

    constructor() public {}

    function addCustomer(
        string memory customerId,
        string memory name,
        string memory passportNumber,
        string memory faceData
    ) public {
        require(
            !customerStore[customerId].isValid,
            "Customer with given ID already exists"
        );

        CustomerData storage customer = customerStore[customerId];

        // update this when fields are added
        customer.isValid = true;
        customer.name = name;
        customer.passportNumber = passportNumber;
        customer.faceData = faceData;
        // flights is implicitly set to empty array

        customers.push(customerId);
    }

    function getCustomer(string memory customerId) public view returns (CustomerData memory) {
      require(
          customerStore[customerId].isValid,
          "Customer with given ID does not exist"
      );

      return customerStore[customerId];
    }

    function addFlight(string memory customerId, string memory flightNo, string memory date) public {
      require(
          customerStore[customerId].isValid,
          "Customer with given ID does not exist"
      );

      CustomerData storage customer = customerStore[customerId];

      customer.flights.push(FlightData(flightNo, date));
    }
}
