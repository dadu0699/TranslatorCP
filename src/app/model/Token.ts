export enum Type {
    RESERVED_BOOL,
    RESERVED_BREAK,
    RESERVED_CASE,
    RESERVED_CHAR,
    RESERVED_CLASS,
    RESERVED_CONTINUE,
    RESERVED_DEFAULT,
    RESERVED_DO,
    RESERVED_DOUBLE,
    RESERVED_ELSE,
    RESERVED_FALSE,
    RESERVED_FLOAT,
    RESERVED_FOR,
    RESERVED_IF,
    RESERVED_INT,
    RESERVED_NEW,
    RESERVED_NULL,
    RESERVED_RETURN,
    RESERVED_STATIC,
    RESERVED_STRING,
    RESERVED_SWITCH,
    RESERVED_TRUE,
    RESERVED_VOID,
    RESERVED_WHILE,
    RESERVED_CONSOLE,
    RESERVED_WRITELINE,
    RESERVED_WRITE,
    SYMBOL_LEFT_CURLY_BRACKET, // {
    SYMBOL_RIGHT_CURLY_BRACKET, // }
    SYMBOL_LEFT_PARENTHESIS, // (
    SYMBOL_RIGHT_PARENTHESIS, // )
    SYMBOL_LEFT_SQUARE_BRACKET, // [
    SYMBOL_RIGHT_SQUARE_BRACKET, // ]
    SYMBOL_COMMA, // ,
    SYMBOL_DOT, // .
    SYMBOL_COLON, // :
    SYMBOL_SEMICOLON, // ;
    SYMBOL_EQUALS, // =
    SYMBOL_PLUS, // +
    SYMBOL_MINUS, // -
    SYMBOL_MULTIPLICATION, // *
    SYMBOL_DIVISION, // /
    SYMBOL_COMPARISON, // ==
    SYMBOL_INEQUALITY, // !=
    SYMBOL_GREATER_THAN_OETS, // >=
    SYMBOL_LESS_THAN_OETS, // <=
    SYMBOL_INCREMENT, // ++
    SYMBOL_DECREMENT, // --
    SYMBOL_GREATER_THAN, // >=
    SYMBOL_LESS_THAN, // <=
    SYMBOL_AND, // &&
    SYMBOL_OR, // ||
    SYMBOL_NOT, // !
    DIGIT,
    DECIMAL,
    ID,
    STR,
    CHARACTER,
    HTML,
    COMMENT,
    MULTILINE_COMMENT
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
            case Type.SYMBOL_COMMA: {
                return 'SYMBOL COMMA';
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