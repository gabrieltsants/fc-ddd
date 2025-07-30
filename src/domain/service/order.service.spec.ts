import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order Service unit tests", () => {

    it("Should place an order", () => {
        const customer = new Customer("1", "Customer");

        const item1 = new OrderItem("i1", "Product 1", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);

    });

    it("Should get total of all orders", () => {
        const item1 = new OrderItem("i1", "Product 1", 100, "p1", 1);
        const item2 = new OrderItem("i2", "Product 2", 200, "p2", 2);

        const order1 = new Order("o1", "client1", [item1]);
        const order2 = new Order("o2", "client2", [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    });
});