import { Token } from 'src/app/model/Token';
import { Type } from 'src/app/model/Token';
import { Error } from 'src/app/model/Error';

export class LexicalAnalyzer {
    private auxiliary: string;
    private state: number;
    private idToken: number;
    private idError: number;
    private row: number;
    private column: number;
    private errorList: Array<Error>;
    private tokenList: Array<Token>;

    constructor() {
        this.auxiliary = '';
        this.state = 0;
        this.idToken = 0;
        this.idError = 0;
        this.row = 1;
        this.column = 1;
        this.errorList = [];
        this.tokenList = [];
    }

    public scanner(entry: string): void {
        let character: string;
        entry += '#';

        for (let i = 0; i < entry.length; i++) {
            character = entry.charAt(i);
            switch (this.state) {
                case 0: {
                    if (this.isLetter(character)) { // Reserved Word
                        this.state = 1;
                        this.auxiliary += character;
                        console.log(character + ' is Letter');
                        console.log(character.codePointAt(0));
                    } else if (this.isNumber(character)) { // Digit
                        this.state = 2;
                        this.auxiliary += character;
                        console.log(character + ' is Digit');
                    }
                }
            }
        }
    }

    private addSymbol(character: string): boolean {
        switch (character) {
            case '{': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_LEFT_CURLY_BRACKET);
                return true;
            }
            case '}': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_RIGHT_CURLY_BRACKET);
                return true;
            }
            case '(': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_LEFT_PARENTHESIS);
                return true;
            }
            case '[': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_LEFT_SQUARE_BRACKET);
                return true;
            }
            case ']': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_RIGHT_SQUARE_BRACKET);
                return true;
            }
            case ',': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_COMMA);
                return true;
            }
            case '.': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_DOT);
                return true;
            }
            case ':': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_COLON);
                return true;
            }
            case ';': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_SEMICOLON);
                return true;
            }
            case '*': {
                this.auxiliary += character;
                this.addToken(Type.SYMBOL_MULTIPLICATION);
                return true;
            }
            default: {
                return false;
            }
        }
    }

    private addWordReserved(): void {
        switch (this.auxiliary) {
            case 'bool': {
                this.addToken(Type.RESERVED_BOOL);
                break;
            }
            case 'break': {
                this.addToken(Type.RESERVED_BOOL);
                break;
            }
            case 'case': {
                this.addToken(Type.RESERVED_CASE);
                break;
            }
            case 'char': {
                this.addToken(Type.RESERVED_CHAR);
                break;
            }
            case 'class': {
                this.addToken(Type.RESERVED_CLASS);
                break;
            }
            case 'continue': {
                this.addToken(Type.RESERVED_CONTINUE);
                break;
            }
            case 'default': {
                this.addToken(Type.RESERVED_DEFAULT);
                break;
            }
            case 'do': {
                this.addToken(Type.RESERVED_DO);
                break;
            }
            case 'double': {
                this.addToken(Type.RESERVED_DOUBLE);
                break;
            }
            case 'else': {
                this.addToken(Type.RESERVED_ELSE);
                break;
            }
            case 'false': {
                this.addToken(Type.RESERVED_FALSE);
                break;
            }
            case 'float': {
                this.addToken(Type.RESERVED_FLOAT);
                break;
            }
            case 'for': {
                this.addToken(Type.RESERVED_FOR);
                break;
            }
            case 'if': {
                this.addToken(Type.RESERVED_IF);
                break;
            }
            case 'int': {
                this.addToken(Type.RESERVED_INT);
                break;
            }
            case 'new': {
                this.addToken(Type.RESERVED_NEW);
                break;
            }
            case 'null': {
                this.addToken(Type.RESERVED_NULL);
                break;
            }
            case 'return': {
                this.addToken(Type.RESERVED_RETURN);
                break;
            }
            case 'static': {
                this.addToken(Type.RESERVED_STATIC);
                break;
            }
            case 'string': {
                this.addToken(Type.RESERVED_STRING);
                break;
            }
            case 'switch': {
                this.addToken(Type.RESERVED_SWITCH);
                break;
            }
            case 'true': {
                this.addToken(Type.RESERVED_TRUE);
                break;
            }
            case 'void': {
                this.addToken(Type.RESERVED_VOID);
                break;
            }
            case 'while': {
                this.addToken(Type.RESERVED_WHILE);
                break;
            }
            case 'Console': {
                this.addToken(Type.RESERVED_CONSOLE);
                break;
            }
            case 'WriteLine': {
                this.addToken(Type.RESERVED_WRITELINE);
                break;
            }
            case 'Write': {
                this.addToken(Type.RESERVED_WRITE);
                break;
            }
            default: {
                this.addToken(Type.ID);
                break;
            }
        }
    }

    private addToken(type: Type): void {
        this.idToken++;
        this.tokenList.push(new Token(this.idToken, this.row,
            this.column - this.auxiliary.length, type, this.auxiliary));
    }

    private addError(character: string) {
        this.idError++;
        this.errorList.push(new Error(this.idError, this.row,
            this.column, character, 'Unknown pattern'));
    }

    private isLetter(character: string): boolean {
        let code: number = character.codePointAt(0);
        if ((code >= 65 && code <= 90)
            || (code >= 97 && code <= 122)) {
            return true;
        }
        return false;
    }

    private isNumber(character: string): boolean {
        let code: number = character.codePointAt(0);
        if (code >= 48 && code <= 57) {
            return true;
        }
        return false;
    }
};