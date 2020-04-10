import { Token } from 'src/app/model/Token';
import { Type } from 'src/app/model/Token';
import { Error } from 'src/app/model/Error';

export class SyntacticAnalyzer {
    private index: number;
    private preAnalysis: Token;
    private syntacticError: boolean;
    private idError: number;
    private errorList: Array<Error>;
    private tokenList: Array<Token>;

    constructor(tokenList: Array<Token>) {
        this.tokenList = tokenList;
        this.index = 0;
        this.preAnalysis = this.tokenList[0];
        this.syntacticError = false;
        this.idError = 0;
        this.errorList = [];

        // this.start();
    }

    private parser(type: Type): void {
        if (this.index < this.tokenList.length - 1) {
            if (this.syntacticError) {
                this.index++;
                this.preAnalysis = this.tokenList[this.index];
                if (this.preAnalysis.getTypeToken() == Type.SYMBOL_SEMICOLON) {
                    this.syntacticError = false;
                }
            } else {
                if (this.preAnalysis.getTypeToken() == type) {
                    this.index++;
                    this.preAnalysis = this.tokenList[this.index];
                } else {
                    this.addError('Was expected \'' + type + '\'');
                    this.syntacticError = true;
                }
            }
        }
    }

    private addError(description: string): void {
        this.idError++;
        this.errorList.push(new Error(this.idError, this.preAnalysis.getRow(),
            this.preAnalysis.getColumn(), this.preAnalysis.toStringTypeToken(),
            description, 'Syntactic'));
    }
};