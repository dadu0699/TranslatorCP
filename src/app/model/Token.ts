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

    public toStringTypeToken(): string {
        switch (this.typeToken) {
            case Type.RESERVED_BOOL: {
                return 'RESERVED BOOL';
            }
            case Type.RESERVED_BREAK: {
                return 'RESERVED BREAK';
            }
            case Type.RESERVED_CASE: {
                return 'RESERVED CASE';
            }
            case Type.RESERVED_CHAR: {
                return 'RESERVED CHAR';
            }
            case Type.RESERVED_CLASS: {
                return 'RESERVED CLASS';
            }
            case Type.RESERVED_CONTINUE: {
                return 'RESERVED CONTINUE';
            }
            case Type.RESERVED_DEFAULT: {
                return 'RESERVED DEFAULT';
            }
            case Type.RESERVED_DO: {
                return 'RESERVED DO';
            }
            case Type.RESERVED_DOUBLE: {
                return 'RESERVED DOUBLE';
            }
            case Type.RESERVED_ELSE: {
                return 'RESERVED ELSE';
            }
            case Type.RESERVED_FALSE: {
                return 'RESERVED FALSE';
            }
            case Type.RESERVED_FLOAT: {
                return 'RESERVED FLOAT';
            }
            case Type.RESERVED_FOR: {
                return 'RESERVED FOR';
            }
            case Type.RESERVED_IF: {
                return 'RESERVED IF';
            }
            case Type.RESERVED_INT: {
                return 'RESERVED INT';
            }
            case Type.RESERVED_NEW: {
                return 'RESERVED NEW';
            }
            case Type.RESERVED_NULL: {
                return 'RESERVED NULL';
            }
            case Type.RESERVED_RETURN: {
                return 'RESERVED RETURN';
            }
            case Type.RESERVED_STATIC: {
                return 'RESERVED STATIC';
            }
            case Type.RESERVED_STRING: {
                return 'RESERVED STRING';
            }
            case Type.RESERVED_SWITCH: {
                return 'RESERVED SWITCH';
            }
            case Type.RESERVED_TRUE: {
                return 'RESERVED TRUE';
            }
            case Type.RESERVED_VOID: {
                return 'RESERVED VOID';
            }
            case Type.RESERVED_WHILE: {
                return 'RESERVED WHILE';
            }
            case Type.RESERVED_CONSOLE: {
                return 'RESERVED CONSOLE';
            }
            case Type.RESERVED_WRITELINE: {
                return 'RESERVED WRITELINE';
            }
            case Type.RESERVED_WRITE: {
                return 'RESERVED WRITE';
            }
            case Type.SYMBOL_LEFT_CURLY_BRACKET: {
                return 'SYMBOL LEFT CURLY BRACKET';
            }
            case Type.SYMBOL_RIGHT_CURLY_BRACKET: {
                return 'SYMBOL RIGHT CURLY BRACKET';
            }
            case Type.SYMBOL_LEFT_PARENTHESIS: {
                return 'SYMBOL LEFT PARENTHESIS';
            }
            case Type.SYMBOL_RIGHT_PARENTHESIS: {
                return 'SYMBOL RIGHT PARENTHESIS';
            }
            case Type.SYMBOL_LEFT_SQUARE_BRACKET: {
                return 'SYMBOL LEFT SQUARE BRACKET';
            }
            case Type.SYMBOL_RIGHT_SQUARE_BRACKET: {
                return 'SYMBOL RIGHT SQUARE BRACKET';
            }
            case Type.SYMBOL_COMMA: {
                return 'SYMBOL COMMA';
            }
            case Type.SYMBOL_DOT: {
                return 'SYMBOL DOT';
            }
            case Type.SYMBOL_COLON: {
                return 'SYMBOL COLON';
            }
            case Type.SYMBOL_SEMICOLON: {
                return 'SYMBOL SEMICOLON';
            }
            case Type.SYMBOL_EQUALS: {
                return 'SYMBOL EQUALS';
            }
            case Type.SYMBOL_PLUS: {
                return 'SYMBOL PLUS';
            }
            case Type.SYMBOL_MINUS: {
                return 'SYMBOL MINUS';
            }
            case Type.SYMBOL_MULTIPLICATION: {
                return 'SYMBOL MULTIPLICATION';
            }
            case Type.SYMBOL_DIVISION: {
                return 'SYMBOL DIVISION';
            }
            case Type.SYMBOL_COMPARISON: {
                return 'SYMBOL COMPARISON';
            }
            case Type.SYMBOL_INEQUALITY: {
                return 'SYMBOL INEQUALITY';
            }
            case Type.SYMBOL_GREATER_THAN_OETS: {
                return 'SYMBOL GREATER-THAN OR EQUAL TO';
            }
            case Type.SYMBOL_LESS_THAN_OETS: {
                return 'SYMBOL LESS-THAN OR EQUAL TO';
            }
            case Type.SYMBOL_INCREMENT: {
                return 'SYMBOL INCREMENT';
            }
            case Type.SYMBOL_DECREMENT: {
                return 'SYMBOL DECREMENT';
            }
            case Type.SYMBOL_GREATER_THAN: {
                return 'SYMBOL GREATER-THAN';
            }
            case Type.SYMBOL_LESS_THAN: {
                return 'SYMBOL LESS-THAN';
            }
            case Type.SYMBOL_AND: {
                return 'SYMBOL AND';
            }
            case Type.SYMBOL_OR: {
                return 'SYMBOL OR';
            }
            case Type.SYMBOL_NOT: {
                return 'SYMBOL NOT';
            }
            case Type.DIGIT: {
                return 'DIGIT';
            }
            case Type.DECIMAL: {
                return 'DECIMAL';
            }
            case Type.ID: {
                return 'ID';
            }
            case Type.STR: {
                return 'STRING';
            }
            case Type.CHARACTER: {
                return 'CHARACTER';
            }
            case Type.HTML: {
                return 'HTML';
            }
            case Type.COMMENT: {
                return 'SINGLE LINE COMMENT';
            }
            case Type.MULTILINE_COMMENT: {
                return 'MULTILINE COMMENT';
            }
        }
    }
};