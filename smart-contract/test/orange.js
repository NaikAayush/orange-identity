const Orange = artifacts.require("Orange")

contract("Test orange", async accounts => {
    it("should add and get new customers", async () => {
        const orange = await Orange.deployed();

        await orange.addCustomer("abc123", "sam", "in1234", "1.2,2.2,3.3");
        const res1 = await orange.getCustomer("abc123");

        assert.equal(res1.isValid, true);
        assert.equal(res1.name, "sam");
        assert.equal(res1.passportNumber, "in1234");
        assert.equal(res1.faceData, "1.2,2.2,3.3");
        assert.equal(res1.flights.length, 0);
    });

    it("should add new customer and flight", async () => {
        const orange = await Orange.deployed();

        // await orange.addCustomer("abc123", "sam", "in1234", "1.2,2.2,3.3");
        await orange.addFlight("abc123", "AB123456", "10-10-2010");
        const res1 = await orange.getCustomer("abc123");

        assert.equal(res1.isValid, true);
        assert.equal(res1.name, "sam");
        assert.equal(res1.passportNumber, "in1234");
        assert.equal(res1.faceData, "1.2,2.2,3.3");
        assert.equal(res1.flights.length, 1);
        assert.equal(res1.flights[0].flightNo, 'AB123456');
        assert.equal(res1.flights[0].date, '10-10-2010');
    });

});