import Customer from "./domain/entity/customer";
import Address from "./domain/entity/address";
import OrderItem from "./domain/entity/order_item";
import Order from "./domain/entity/order";

let address = new Address("1", 1, "123", "New York");
let customer = new Customer("1", "John");
customer.Address = address;
customer.activate();


const item1 = new OrderItem("1", "Item 1", 100);
const item2 = new OrderItem("2", "Item 2", 200);
const order = new Order("1", "1", [item1, item2]);