export class Error {
    private idError: number;
    private row: number;
    private column: number;
    private character: string;
    private description: string;

    constructor(idError: number, row: number, column: number, character: string, description: string) {
        this.idError = idError;
        this.row = row;
        this.column = column;
        this.character = character;
        this.description = description;
    }
};