import Address from "./address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address; // "Indica que pode inicializar depois"
    private _active: boolean = true;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    // Definir dessa forma é melhor que criar um setter anemico, pois deixa a regra de negócio explicita
    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    // O mesmo para changeName, temos um domínio rico e expressivo (screaming architecture)
    changeName(name: string) {
        this._name = name;
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    isActive(): boolean {
        return this._active;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }

        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get Address(): Address {
        return this._address;
    }

    set Address(address: Address) {
        this._address = address;
    }
}