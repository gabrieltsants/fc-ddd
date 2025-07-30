import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("1", 1, "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 1",
            active: true,
            zip: 1,
            city: "City 1",
            rewardPoints: 0
        });
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("1", 1, "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        customer.changeName("Customer 2");

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 2",
            active: true,
            zip: 1,
            city: "City 1",
            rewardPoints: 0
        });
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("1", 1, "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const customerDb = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerDb.id).toBe("1");
        expect(customerDb.toJSON()).toStrictEqual({
            id: "1",
            name: "Customer 1",
            active: true,
            zip: 1,
            city: "City 1",
            rewardPoints: 0
        })
    })

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "Customer 1");
        customer1.addRewardPoints(10);
        const address1 = new Address("1", 1, "City 1");
        customer1.changeAddress(address1);

        await customerRepository.create(customer1);

        const customer2 = new Customer("2", "Customer 2");
        customer2.addRewardPoints(20);
        const address2 = new Address("2", 2, "City 2");
        customer2.changeAddress(address2);

        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    })

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();


        await expect(customerRepository.find("1ab122")).rejects.toThrow("Customer 1ab122 not found");
    })
});