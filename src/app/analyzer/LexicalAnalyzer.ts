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
                    } else if (this.isNumber(character)) { // Digit
                        this.state = 2;
                        this.auxiliary += character;
                    } else if (character === '\"') { // String
                        this.state = 3;
                        this.auxiliary += character;
                    } else if (character === '=') { // Assignment AND Equal to
                        this.state = 4;
                        this.auxiliary += character;
                    } else if (character === '!') { // Not AND Inequality
                        this.state = 5;
                        this.auxiliary += character;
                    } else if (character === '<') { // Less than AND Less than or Equal to
                        this.state = 6;
                        this.auxiliary += character;
                    } else if (character === '>') { // Greater than AND Greater than or Equal to
                        this.state = 7;
                        this.auxiliary += character;
                    } else if (character === '/') { // Division, Single Line Comments AND Multiline Comment
                        this.state = 8;
                        this.auxiliary += character;
                    } else if (character === '\'') { // Character AND HTML
                        this.state = 12;
                        this.auxiliary += character;
                    } else if (character === '+') { // Plus and Increment operators
                        this.state = 14;
                        this.auxiliary += character;
                    } else if (character === '-') { // Minus and Decrement operators
                        this.state = 15;
                        this.auxiliary += character;
                    } else if (character === '&') { // And
                        this.state = 16;
                        this.auxiliary += character;
                    } else if (character === '|') { // Or
                        this.state = 17;
                        this.auxiliary += character;
                    } else if (this.isWhiteSpace(character)) {
                        this.state = 0;
                        this.auxiliary = '';
                        // Change row and restart columns in line breaks
                        if (character === '\n') {
                            this.column = 1;
                            this.row++;
                        }
                    } else if (!this.addSymbol(character)) { // Symbol
                        if (character === '#' && i == (entry.length - 1)) {
                            console.log('Lexical analysis completed');
                        } else {
                            console.log('Lexical Error: Not Found "' + character + '" in defined patterns');
                            this.addError(character);
                            this.state = 0;
                        }
                    }
                    break;
                }
                case 1: {
                    if (this.isLetter(character) || this.isNumber(character) || character === '_') {
                        this.state = 1;
                        this.auxiliary += character;
                    } else {
                        this.addWordReserved();
                        i--;
                    }
                    break;
                }
                case 2: {
                    if (this.isNumber(character)) {
                        this.state = 2;
                        this.auxiliary += character;
                    } else if (character === '.') {
                        this.state = 13;
                        this.auxiliary += character;
                    } else {
                        this.addToken(Type.DIGIT);
                        i--;
                    }
                    break;
                }
                case 3: {
                    if (character !== '\"') {
                        this.state = 3;
                        this.auxiliary += character;
                    } else {
                        this.auxiliary += character;
                        this.addToken(Type.STR);
                    }
                    break;
                }
                case 4: {
                    if (character === '=') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_COMPARISON);
                    }
                    else {
                        this.addToken(Type.SYMBOL_EQUALS);
                        i--;
                    }
                    break;
                }
                case 5: {
                    if (character === '=') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_INEQUALITY);
                    } else {
                        this.addToken(Type.SYMBOL_NOT);
                        i--;
                    }
                    break;
                }
                case 6: {
                    if (character === '=') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_LESS_THAN_OETS);
                    } else {
                        this.addToken(Type.SYMBOL_LESS_THAN);
                        i--;
                    }
                    break;
                }
                case 7: {
                    if (character === '=') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_GREATER_THAN_OETS);
                    } else {
                        this.addToken(Type.SYMBOL_GREATER_THAN);
                        i--;
                    }
                    break;
                }
                case 8: {
                    if (character === '/') {
                        this.state = 9;
                        this.auxiliary += character;
                    } else if (character === '*') {
                        this.state = 10;
                        this.auxiliary += character;
                    } else {
                        this.addToken(Type.SYMBOL_DIVISION);
                        i--;
                    }
                    break;
                }
                case 9: {
                    if (character !== '\n') {
                        this.state = 9;
                        this.auxiliary += character;
                    } else {
                        this.auxiliary += character;
                        this.addToken(Type.COMMENT);
                    }
                    break;
                }
                case 10: {
                    if (character !== '*') {
                        this.state = 10;
                        this.auxiliary += character;
                    } else {
                        this.state = 11;
                        this.auxiliary += character;
                    }
                    break;
                }
                case 11: {
                    if (character !== '/') {
                        this.state = 10;
                        this.auxiliary += character;
                    } else {
                        this.auxiliary += character;
                        this.addToken(Type.MULTILINE_COMMENT);
                    }
                    break;
                }
                case 12: {
                    if (character !== '\'') {
                        this.state = 12;
                        this.auxiliary += character;
                    } else {
                        this.auxiliary += character;
                        this.addToken(Type.HTML);
                    }
                    break;
                }
                case 13: {
                    if (this.isNumber(character)) {
                        this.state = 13;
                        this.auxiliary += character;
                    } else {
                        this.addToken(Type.DECIMAL);
                        i--;
                    }
                    break;
                }
                case 14: {
                    if (character === '+') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_INCREMENT);
                    } else {
                        this.addToken(Type.SYMBOL_PLUS);
                        i--;
                    }
                    break;
                }
                case 15: {

                    if (character === '-') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_DECREMENT);
                    } else {
                        this.addToken(Type.SYMBOL_MINUS);
                        i--;
                    }
                    break;
                }
                case 16: {
                    if (character === '&') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_AND);
                    } else {
                        console.log('Lexical Error: Not Found "' + character + '" in defined patterns');
                        this.addError(character);
                        this.auxiliary = '';
                        this.state = 0;
                        i--;
                    }
                    break;
                }
                case 17: {
                    if (character === '|') {
                        this.auxiliary += character;
                        this.addToken(Type.SYMBOL_OR);
                    } else {
                        console.log('Lexical Error: Not Found "' + character + '" in defined patterns');
                        this.addError(character);
                        this.auxiliary = '';
                        this.state = 0;
                        i--;
                    }
                    break;
                }
            }
            this.column++;
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
        this.auxiliary = '';
        this.state = 0;
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

    private isWhiteSpace(character: string): boolean {
        return (/^\s*$/.test(character));
    }

    public getTokenList(): void {
        this.tokenList.forEach(element => {
            console.log(element.getValue() + ' ' + element.toStringTypeToken());
        });
    }
};