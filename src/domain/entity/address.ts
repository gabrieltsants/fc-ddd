export default class Address {
    _id: string = "";
    _street: string = "";
    _zip: number = 0;
    _city: string = "";

    constructor(id: string, zip: number, city: string) {
        this._id = id;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }

        if (this._zip === 0) {
            throw new Error("Zip is required");
        }

        // if (this._street.length === 0) {
        //     throw new Error("Street is required");
        // }

        if (this._city.length === 0) {
            throw new Error("City is required");
        }
    }

    get street(): string {
        return this._street;
    }

    get zip(): number {
        return this._zip;
    }

    get number(): number {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    toString() {
        return `${this._street}, ${this._zip}, ${this._city}`
    }
}