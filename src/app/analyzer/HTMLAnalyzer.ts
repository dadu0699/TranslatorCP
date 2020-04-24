import { TokenHTML } from 'src/app/model/TokenHTML';
import { Type } from 'src/app/model/TokenHTML';
import { Error } from 'src/app/model/Error';

export class HTMLAnalyzer {
    private auxiliary: string;
    private state: number;
    private idToken: number;
    private idError: number;
    private row: number;
    private column: number;
    private errorList: Array<Error>;
    private tokenList: Array<TokenHTML>;

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
        entry += '\n#';

        for (let i = 0; i < entry.length; i++) {
            character = entry.charAt(i);

            switch (this.state) {
                case 0: {
                    if (character === '<') { // Opening tag AND Closing tag
                        this.state = 1;
                    } else {
                        this.state = 2;
                    }
                    this.auxiliary += character;
                    break;
                }
                case 1: {
                    if (character !== '/') {
                        this.state = 3;
                    } else {
                        this.state = 4;
                    }
                    this.auxiliary += character;
                    break;
                }
                case 2: {
                    if (character !== '<') {
                        this.state = 2;
                        this.auxiliary += character;
                    } else {
                        this.addToken(Type.CONTENT);
                        i--;
                    }
                    break;
                }
                case 3: {
                    if (character !== '>') {
                        this.state = 3;
                        if (!this.isWhiteSpace(character)) {
                            this.auxiliary += character;
                        }
                    } else {
                        this.auxiliary += character;
                        this.addOpeningTag();
                    }
                    break;
                }
                case 4: {
                    if (character !== '>') {
                        this.state = 4;
                        if (!this.isWhiteSpace(character)) {
                            this.auxiliary += character;
                        }
                    } else {
                        this.auxiliary += character;
                        this.addClosingTag();
                    }
                    break;
                }
            }
            this.column++;
        }
    }

    private addOpeningTag(): void {
        switch (this.auxiliary.toLowerCase()) {
            case '<!doctypehtml>': {
                this.auxiliary = this.auxiliary
                    .replace('DOCTYPE', 'DOCTYPE ')
                    .replace('doctype', 'doctype ');
                this.addToken(Type.DOCTYPE_TAG);
                break;
            } case '<html>': {
                this.addToken(Type.HTML_TAG);
                break;
            }
            case '<head>': {
                this.addToken(Type.HEAD_TAG);
                break;
            }
            case '<bodystyle="background:yellow">':
            case '<bodystyle="background:green">':
            case '<bodystyle="background:blue">':
            case '<bodystyle="background:red">':
            case '<bodystyle="background:white">':
            case '<bodystyle="background:skyblue">':
            case '<body>': {
                this.auxiliary = this.auxiliary.replace('style=', ' style=');
                this.addToken(Type.BODY_TAG);
                break;
            }
            case '<title>': {
                this.addToken(Type.TITLE_TAG);
                break;
            }
            case '<divstyle="background:yellow">':
            case '<divstyle="background:green">':
            case '<divstyle="background:blue">':
            case '<divstyle="background:red">':
            case '<divstyle="background:white">':
            case '<divstyle="background:skyblue">':
            case '<div>': {
                this.auxiliary = this.auxiliary.replace('style=', ' style=');
                this.addToken(Type.DIV_TAG);
                break;
            }
            case '<br>': {
                this.addToken(Type.BR_TAG);
                break;
            }
            case '<p>': {
                this.addToken(Type.P_TAG);
                break;
            }
            case '<h1>': {
                this.addToken(Type.H1_TAG);
                break;
            }
            case '<button>': {
                this.addToken(Type.BUTTON_TAG);
                break;
            }
            case '<label>': {
                this.addToken(Type.LABEL_TAG);
                break;
            }
            case '<input>': {
                this.addToken(Type.INPUT_TAG);
                break;
            }
            default: {
                console.log('Lexical Error: Not Found "' + this.auxiliary + '" in defined patterns');
                this.addError(this.auxiliary);
                this.auxiliary = '';
                this.state = 0;
                break;
            }
        }
    }

    private addClosingTag(): void {
        switch (this.auxiliary.toLowerCase()) {
            case '</html>': {
                this.addToken(Type.HTML_CLOSING_TAG);
                break;
            }
            case '</head>': {
                this.addToken(Type.HEAD_CLOSING_TAG);
                break;
            }
            case '</body>': {
                this.addToken(Type.BODY_CLOSING);
                break;
            }
            case '</title>': {
                this.addToken(Type.TITLE_CLOSING_TAG);
                break;
            }
            case '</div>': {
                this.addToken(Type.DIV_CLOSING_TAG);
                break;
            }
            case '</p>': {
                this.addToken(Type.P_CLOSING_TAG);
                break;
            }
            case '</h1>': {
                this.addToken(Type.H1_CLOSING_TAG);
                break;
            }
            case '</button>': {
                this.addToken(Type.BUTTON_CLOSING_TAG);
                break;
            }
            case '</label>': {
                this.addToken(Type.LABEL_CLOSING_TAG);
                break;
            }
            default: {
                console.log('Lexical Error: Not Found "' + this.auxiliary + '" in defined patterns');
                this.addError(this.auxiliary);
                this.auxiliary = '';
                this.state = 0;
                break;
            }
        }
    }

    private addToken(type: Type): void {
        this.idToken++;
        this.tokenList.push(new TokenHTML(this.idToken, this.row,
            this.column - this.auxiliary.length, type, this.auxiliary));
        this.auxiliary = '';
        this.state = 0;
    }

    private addError(character: string) {
        this.idError++;
        this.errorList.push(new Error(this.idError, this.row,
            this.column, character, 'Unknown pattern', 'Lexical'));
    }

    private isWhiteSpace(character: string): boolean {
        return (/^\s*$/.test(character));
    }

    public getTokenList(): Array<TokenHTML> {
        return this.tokenList;
    }

    public getErrorList(): Array<Error> {
        return this.errorList;
    }
}