import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "./db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        CustomerModel.create({
            id: entity.id,
            name: entity.name,
            zip: entity.Address.zip,
            city: entity.Address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            zip: entity.Address.zip,
            city: entity.Address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        }, {
            where: {
                id: entity.id
            }
        });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({ where: { id }, attributes: ['id', 'name', 'zip', 'city', 'active', 'rewardPoints'], rejectOnEmpty: true });
        } catch (error) {
            throw new Error(`Customer ${id} not found`);
        }

        const customer = new Customer(customerModel.id, customerModel.name);
        customer.Address = new Address(customerModel.id, customerModel.zip, customerModel.city);
        customer.addRewardPoints(customerModel.rewardPoints);
        customer.activate();

        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        return customerModels.map((customerModel) => {
            const customer = new Customer(customerModel.id, customerModel.name);
            customer.Address = new Address(customerModel.id, customerModel.zip, customerModel.city);
            customer.addRewardPoints(customerModel.rewardPoints);
            customer.activate();
            return customer;
        });
    }
}