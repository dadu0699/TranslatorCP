export class Symbol {
    private idSymbol: number;
    private type: string;
    private name: string;
    private value: string;
    private row: number;

    constructor(idSymbol: number, type: string, name: string, value: string, row: number) {
        this.idSymbol = idSymbol;
        this.type = type;
        this.name = name;
        this.value = value;
        this.row = row;
    }

    public getIDSymbol(): number {
        return this.idSymbol;
    }

    public getType(): string {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public getValue(): string {
        return this.value;
    }

    public getRow(): number {
        return this.row;
    }
};