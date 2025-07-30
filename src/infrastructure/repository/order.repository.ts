import Order from "../../domain/entity/order";
import OrderItemModel from "./db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderModel from "./db/sequelize/model/order.model";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface { //implements OrderRepositoryInterface

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity,
                total: item.orderItemTotal()
            })),
        },
            {
                include: [
                    {
                        model: OrderItemModel
                    }
                ]
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customerId: entity.customerId,
                total: entity.total(),
            },
            {
                where: { id: entity.id },
            }
        );

        await OrderItemModel.destroy({
            where: { orderId: entity.id },
        });

        const items = entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            total: item.orderItemTotal(),
            orderId: entity.id,
        }));

        await OrderItemModel.bulkCreate(items);
    }

    async find(id: string): Promise<Order> {
        const orderDb = await OrderModel.findOne({ where: { id: id }, include: ["items"] });

        return new Order(
            orderDb.id,
            orderDb.customerId,
            orderDb.items.map((item) => {
                return new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.productId,
                    item.quantity,
                )
            })

        );

    }

    async findAll(): Promise<Order[]> {

        const ordersDb = await OrderModel.findAll({ include: ["items"] });

        return ordersDb.map((order) => {
            return new Order(
                order.id,
                order.customerId,
                order.items.map((item) => {
                    return new OrderItem(
                        item.id,
                        item.name,
                        item.price,
                        item.productId,
                        item.quantity,
                    )
                })
            )
        });
    }
}