import Address from "./address";
import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrow("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "", []);
        }).toThrow("CustomerId is required");
    });

    it("Item quantity must be greater than 0 ", () => {
        expect(() => {
            let order = new Order("1", "2", [])
        }).toThrow("Item quantity must be greater than 0");
    });

    it("Should calculate total", () => {

        const item1 = new OrderItem("1", "Product 1", 100, "p1", 2);
        let order = new Order("1", "12", [item1]);

        let total = order.total();

        expect(total).toBe(200);

        const item2 = new OrderItem("2", "Product 2", 200, "p2", 2);
        order = new Order("1", "12", [item1, item2]);
        total = order.total();

        expect(total).toBe(600);
    });

    it("Should throw error if the quantity is greater than 0", () => {

        expect(() => {
            const item1 = new OrderItem("1", "Product 1", 100, "p1", 0);
            let order = new Order("1", "12", [item1]);

        }).toThrow("Order Item quantity must be greater than 0");
    });
});