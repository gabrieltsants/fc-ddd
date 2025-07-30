import Product from "./product";

describe("Product unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let product = new Product("", "Product 1", 100);
        }).toThrow("Id is required");
    });

    it("shoud throw error when name is empty", () => {
        expect(() => {
            let product = new Product("123", "", 100);
        }).toThrow("Name is required");
    });

    it("should throw error when price is les than 0", () => {
        expect(() => {
            let product = new Product("123", "Product 1", -1);
        }).toThrow("Price must be greater than 0");
    });

    it("Should change name", () => {
        const product = new Product("123", "Product 1", 123);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    it("Should change price", () => {
        const product = new Product("111", "Product 1", 100);
        product.changePrice(200);
        expect(product.price).toBe(200);
    })
});