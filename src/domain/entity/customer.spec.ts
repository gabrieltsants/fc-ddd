import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John Marston");
        }).toThrow("Id is required")
    });

    it("Should change name", () => {
        // Arrange
        const customer = new Customer("123", "John Martson");

        // Act
        customer.changeName("Jim Milton");

        // Assert
        expect(customer.name).toBe("Jim Milton");
    });

    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("1", 1, "123", "New York");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });


    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("Should throw error when address is undefined", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");
    });

    it("should add rewardp points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});