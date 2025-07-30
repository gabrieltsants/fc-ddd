import { Sequelize } from "sequelize-typescript";
import OrderModel from "./db/sequelize/model/order.model";
import OrderRepository from "./order.repository";
import Order from "../../domain/entity/order";
import Address from "../../domain/entity/address";
import ProductModel from "./db/sequelize/model/product.model";
import OrderItemModel from "./db/sequelize/model/order-item.model";
import CustomerModel from "./db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([OrderModel, CustomerModel, ProductModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    })

    it("Should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Martson");
        const address = new Address("1", 123, "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();

        const product = new Product("321", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customerId: "1",
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                orderId: "123",
                productId: "321",
                total: orderItem.orderItemTotal()
            }],
            total: order.total(), // ou 20
        })
    });

    it("Should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Martson");
        const address = new Address("1", 123, "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();

        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const updatedItem = new OrderItem("1", product.name, product.price, product.id, 1);
        const updatedOrder = new Order("123", customer.id, [updatedItem]);
        await orderRepository.update(updatedOrder);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customerId: "1",
            items: [{
                id: updatedItem.id,
                name: updatedItem.name,
                price: updatedItem.price,
                quantity: updatedItem.quantity,
                orderId: "123",
                productId: "1",
                total: updatedItem.orderItemTotal()
            }],
            total: updatedOrder.total(),
        })
    });

    it("Should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "John Martson");
        const address = new Address("1", 123, "City 1");

        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();

        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderDb = await orderRepository.find("123");

        expect(orderDb.id).toBe("123");
        expect(orderDb.customerId).toBe("1");
        expect(orderDb.items).toEqual([orderItem]);
    })

    it("Should find all orders", async () => {
        const customerRepository = new CustomerRepository();

        const customer1 = new Customer("1", "John Martson");
        const customer2 = new Customer("2", "Arthur Morgan");

        const address1 = new Address("1", 123, "City 1");
        const address2 = new Address("2", 123, "City 2");

        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();

        const product1 = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 4);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 2);

        const order1 = new Order("1", customer1.id, [orderItem1]);
        const order2 = new Order("2", customer2.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = [order1, order2];
        const ordersDb = await orderRepository.findAll();

        expect(orders).toEqual(ordersDb);
    })
});