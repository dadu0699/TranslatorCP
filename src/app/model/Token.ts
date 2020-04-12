export enum Type {
    RESERVED_BOOL = 'RESERVED BOOL',
    RESERVED_BREAK = 'RESERVED BREAK',
    RESERVED_CASE = 'RESERVED CASE',
    RESERVED_CHAR = 'RESERVED CHAR',
    RESERVED_CLASS = 'RESERVED CLASS',
    RESERVED_CONTINUE = 'RESERVED CONTINUE',
    RESERVED_DEFAULT = 'RESERVED DEFAULT',
    RESERVED_DO = 'RESERVED DO',
    RESERVED_DOUBLE = 'RESERVED DOUBLE',
    RESERVED_ELSE = 'RESERVED ELSE',
    RESERVED_FALSE = 'RESERVED FALSE',
    RESERVED_FLOAT = 'RESERVED FLOAT',
    RESERVED_FOR = 'RESERVED FOR',
    RESERVED_IF = 'RESERVED IF',
    RESERVED_INT = 'RESERVED INT',
    RESERVED_NEW = 'RESERVED NEW',
    RESERVED_NULL = 'RESERVED NULL',
    RESERVED_RETURN = 'RESERVED RETURN',
    RESERVED_STATIC = 'RESERVED STATIC',
    RESERVED_STRING = 'RESERVED STRING',
    RESERVED_SWITCH = 'RESERVED SWITCH',
    RESERVED_TRUE = 'RESERVED TRUE',
    RESERVED_VOID = 'RESERVED VOID',
    RESERVED_WHILE = 'RESERVED WHILE',
    RESERVED_CONSOLE = 'RESERVED CONSOLE',
    RESERVED_WRITELINE = 'RESERVED WRITELINE',
    RESERVED_WRITE = 'RESERVED WRITE',
    SYMBOL_LEFT_CURLY_BRACKET = 'SYMBOL LEFT CURLY BRACKET', // {
    SYMBOL_RIGHT_CURLY_BRACKET = 'SYMBOL RIGHT CURLY BRACKET', // }
    SYMBOL_LEFT_PARENTHESIS = 'SYMBOL LEFT PARENTHESIS', // (
    SYMBOL_RIGHT_PARENTHESIS = 'SYMBOL RIGHT PARENTHESIS', // )
    SYMBOL_LEFT_SQUARE_BRACKET = 'SYMBOL LEFT SQUARE BRACKET', // [
    SYMBOL_RIGHT_SQUARE_BRACKET = 'SYMBOL RIGHT SQUARE BRACKET', // ]
    SYMBOL_COMMA = 'SYMBOL COMMA', // ,
    SYMBOL_DOT = 'SYMBOL DOT', // .
    SYMBOL_COLON = 'SYMBOL COLON', // :
    SYMBOL_SEMICOLON = 'SYMBOL SEMICOLON', // ;
    SYMBOL_EQUALS = 'SYMBOL EQUALS', // =
    SYMBOL_PLUS = 'SYMBOL PLUS', // +
    SYMBOL_MINUS = 'SYMBOL MINUS', // -
    SYMBOL_MULTIPLICATION = 'SYMBOL MULTIPLICATION', // *
    SYMBOL_DIVISION = 'SYMBOL DIVISION', // /
    SYMBOL_COMPARISON = 'SYMBOL COMPARISON', // ==
    SYMBOL_INEQUALITY = 'SYMBOL INEQUALITY', // !=
    SYMBOL_GREATER_THAN_OETS = 'SYMBOL GREATER-THAN OR EQUAL TO', // >=
    SYMBOL_LESS_THAN_OETS = 'SYMBOL LESS-THAN OR EQUAL TO', // <=
    SYMBOL_INCREMENT = 'SYMBOL INCREMENT', // ++
    SYMBOL_DECREMENT = 'SYMBOL DECREMENT', // --
    SYMBOL_GREATER_THAN = 'SYMBOL GREATER-THAN', // >
    SYMBOL_LESS_THAN = 'SYMBOL LESS-THAN', // <
    SYMBOL_AND = 'SYMBOL AND', // &&
    SYMBOL_OR = 'SYMBOL OR', // ||
    SYMBOL_NOT = 'SYMBOL NOT', // !
    DIGIT = 'DIGIT',
    DECIMAL = 'DECIMAL',
    ID = 'ID',
    STR = 'STRING',
    CHARACTER = 'CHARACTER',
    HTML = 'HTML',
    COMMENT = 'SINGLE LINE COMMENT',
    MULTILINE_COMMENT = 'MULTILINE COMMENT'
}

export class Token {
    private idToken: number;
    private row: number;
    private column: number;
    private typeToken: Type;
    private value: string;

    constructor(idToken: number, row: number, column: number, typeToken: Type, value: string) {
        this.idToken = idToken;
        this.row = row;
        this.column = column;
        this.typeToken = typeToken;
        this.value = value;
    }

    public getIDToken(): number {
        return this.idToken;
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.column;
    }

    public getValue(): string {
        return this.value;
    }

    public getTypeToken(): Type {
        return this.typeToken;
    }
};