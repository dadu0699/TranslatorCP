import { Token } from 'src/app/model/Token';
import { Type } from 'src/app/model/Token';

export class Translator {
    private index: number;
    private preAnalysis: Token;
    private tokenList: Array<Token>;
    private translate: string
    private counterTabulations: number;

    constructor(tokenList: Array<Token>) {
        this.tokenList = tokenList;
        this.tokenList.push(new Token(null, null, null, Type.EOF, null))
        this.index = 0;
        this.translate = '';
        this.preAnalysis = this.tokenList[0];
        this.counterTabulations = 0;

        this.start();
    }

    private start(): void {
        this.commentary();
        this.parser(Type.RESERVED_CLASS);
        this.parser(Type.ID);
        this.parser(Type.SYMBOL_LEFT_CURLY_BRACKET);
        this.bodyClass();
        this.parser(Type.SYMBOL_RIGHT_CURLY_BRACKET);
        this.commentary();
    }

    private commentary(): void {
        if (this.preAnalysis.getTypeToken() == Type.COMMENT
            || this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.commentaryP();
            this.commentary();
        }
    }

    private commentaryP(): void {
        if (this.preAnalysis.getTypeToken() == Type.COMMENT) {
            this.translate += this.preAnalysis.getValue().replace('//', '#');
            this.parser(Type.COMMENT);
        } else if (this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            let comment: string = this.preAnalysis.getValue()
                .replace('\t', '').replace('/*', '\'\'\'').replace('*/', '\'\'\'');

            let splitComment: Array<string> = comment.split('\n');
            this.translate += splitComment[0] + '\n';
            this.counterTabulations++;
            for (let i = 1; i < (splitComment.length - 1); i++) {
                this.translate += '    ';
                this.translate += splitComment[i].trim();
                this.translate += '\n';
            }
            this.counterTabulations--;
            this.translate += splitComment[splitComment.length - 1].trim();
            this.translate += '\n';

            this.parser(Type.MULTILINE_COMMENT);
        }
    }

    private bodyClass() {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_VOID
            || this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR
            || this.preAnalysis.getTypeToken() == Type.COMMENT
            || this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.bodyClassP();
            this.bodyClass();
        }
    }

    private bodyClassP(): void {
        this.method();
        this.commentary();
    }

    private method(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_VOID
            || this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.methodP();
            this.method();
        }
    }

    private methodP(): void {
        this.methodType();

        this.parser(Type.ID);
        if ((this.tokenList[this.index - 2].getTypeToken() == Type.RESERVED_INT
            || this.tokenList[this.index - 2].getTypeToken() == Type.RESERVED_STRING
            || this.tokenList[this.index - 2].getTypeToken() == Type.RESERVED_DOUBLE
            || this.tokenList[this.index - 2].getTypeToken() == Type.RESERVED_BOOL
            || this.tokenList[this.index - 2].getTypeToken() == Type.RESERVED_CHAR)
            && (this.tokenList[this.index].getTypeToken() == Type.SYMBOL_EQUALS
                || this.tokenList[this.index].getTypeToken() == Type.SYMBOL_COMMA
                || this.tokenList[this.index].getTypeToken() == Type.SYMBOL_SEMICOLON)) {
            this.index -= 2;
            this.preAnalysis = this.tokenList[this.index];
            this.declaration();
        } else {
            let rMain: boolean = (this.tokenList[this.index - 1].getValue() == 'main');

            this.translate += '\ndef '
            this.translate += this.tokenList[this.index - 1].getValue();

            this.translate += this.preAnalysis.getValue();
            this.parser(Type.SYMBOL_LEFT_PARENTHESIS);

            this.methodParameter();

            this.translate += this.preAnalysis.getValue() + ':\n';
            this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
            this.body();

            if (rMain) {
                this.translate += '\nif __name__ == "__main__":\n\tmain()\n'
            }
        }
    }

    private methodType(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_VOID) {
            this.parser(Type.RESERVED_VOID);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.type();
        }
    }

    private type(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT) {
            this.parser(Type.RESERVED_INT);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_STRING) {
            this.parser(Type.RESERVED_STRING);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE) {
            this.parser(Type.RESERVED_DOUBLE);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL) {
            this.parser(Type.RESERVED_BOOL);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.parser(Type.RESERVED_CHAR);
        }
    }

    private methodParameter(): void {
        if (this.preAnalysis.getTypeToken() != Type.SYMBOL_RIGHT_PARENTHESIS) {
            this.parameter();
        }
    }

    private parameter(): void {
        this.type();

        this.translate += this.preAnalysis.getValue();
        this.parser(Type.ID);

        this.parameterP();
    }

    private parameterP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {

            this.translate += this.preAnalysis.getValue() + ' ';
            this.parser(Type.SYMBOL_COMMA);

            this.parameter();
        }
    }

    private body(): void {
        this.counterTabulations++;
        this.parser(Type.SYMBOL_LEFT_CURLY_BRACKET);
        this.addIndentation();
        this.instruction();
        this.parser(Type.SYMBOL_RIGHT_CURLY_BRACKET);
        this.counterTabulations--;
    }

    private instruction(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR
            || this.preAnalysis.getTypeToken() == Type.ID
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CONSOLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_IF
            || this.preAnalysis.getTypeToken() == Type.RESERVED_SWITCH
            || this.preAnalysis.getTypeToken() == Type.RESERVED_FOR
            || this.preAnalysis.getTypeToken() == Type.RESERVED_WHILE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DO
            || this.preAnalysis.getTypeToken() == Type.RESERVED_RETURN
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BREAK
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CONTINUE
            || this.preAnalysis.getTypeToken() == Type.COMMENT
            || this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.instructionP();
            this.instruction();
        }
    }

    private instructionP(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.declaration();
        } else if (this.preAnalysis.getTypeToken() == Type.ID) {
            this.assignment();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_CONSOLE) {
            this.printStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_IF) {
            this.ifStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_SWITCH) {
            this.switchStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_FOR) {
            //this.forStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_WHILE) {
            //this.whileStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_DO) {
            //this.doStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_RETURN) {
            //this.returnStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_BREAK) {
            //this.breakStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_CONTINUE) {
            //this.continueStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.COMMENT
            || this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.commentary();
        }
    }

    private declaration(): void {
        this.type();
        this.idList();
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private idList(): void {
        this.parser(Type.ID);
        this.assignVariable();
        this.idListP();
    }

    private idListP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {
            this.parser(Type.SYMBOL_COMMA);
            this.idList();
        }
    }

    private assignVariable(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_EQUALS) {
            this.translate += this.tokenList[this.index - 1].getValue() + ' ';
            this.translate += this.preAnalysis.getValue() + ' ';
            this.parser(Type.SYMBOL_EQUALS);
            this.expression();
            this.translate += '\n';
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.iterator();
        }
        this.addIndentation();
    }

    private expression(): void {
        this.factor();
        this.expressionP();
    }

    private expressionP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_PLUS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_MINUS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_MULTIPLICATION
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_DIVISION) {
            this.arithmetic();
            this.expression();
        }
    }

    private factor(): void {
        this.translate += this.preAnalysis.getValue();
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS) {
            this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
            this.expression();
            this.translate += this.preAnalysis.getValue();
            this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        } else if (this.preAnalysis.getTypeToken() == Type.DIGIT) {
            this.parser(Type.DIGIT);
        } else if (this.preAnalysis.getTypeToken() == Type.DECIMAL) {
            this.parser(Type.DECIMAL);
        } else if (this.preAnalysis.getTypeToken() == Type.ID) {
            this.parser(Type.ID);
            this.invokeMethod();
        } else if (this.preAnalysis.getTypeToken() == Type.STR) {
            this.parser(Type.STR);
        } else if (this.preAnalysis.getTypeToken() == Type.CHARACTER) {
            this.parser(Type.CHARACTER);
        } else if (this.preAnalysis.getTypeToken() == Type.HTML) {
            this.parser(Type.HTML);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE) {
            this.parser(Type.RESERVED_TRUE);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
            this.parser(Type.RESERVED_FALSE);
        }
    }

    private invokeMethod(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS) {

            this.translate += this.preAnalysis.getValue();
            this.parser(Type.SYMBOL_LEFT_PARENTHESIS);

            if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS
                || this.preAnalysis.getTypeToken() == Type.DIGIT
                || this.preAnalysis.getTypeToken() == Type.DECIMAL
                || this.preAnalysis.getTypeToken() == Type.ID
                || this.preAnalysis.getTypeToken() == Type.STR
                || this.preAnalysis.getTypeToken() == Type.CHARACTER
                || this.preAnalysis.getTypeToken() == Type.HTML
                || this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE
                || this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
                this.expression();
                this.invokeMethodP();
            }

            this.translate += this.preAnalysis.getValue();
            this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        }
    }

    private invokeMethodP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {

            this.translate += this.preAnalysis.getValue() + ' ';
            this.parser(Type.SYMBOL_COMMA);

            this.expression();
            this.invokeMethodP();
        }
    }

    private arithmetic(): void {
        this.translate += this.preAnalysis.getValue();
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_PLUS) {
            this.parser(Type.SYMBOL_PLUS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_MINUS) {
            this.parser(Type.SYMBOL_MINUS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_MULTIPLICATION) {
            this.parser(Type.SYMBOL_MULTIPLICATION);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DIVISION) {
            this.parser(Type.SYMBOL_DIVISION);
        }
    }

    private iterator(): void {
        this.translate += this.preAnalysis.getValue();
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT) {
            this.translate += '+= 1';
            this.parser(Type.SYMBOL_INCREMENT);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.translate += '-= 1';
            this.parser(Type.SYMBOL_DECREMENT);
        }
    }

    private assignment(): void {
        this.parser(Type.ID);
        this.assignVariable();
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private printStatement(): void {
        this.parser(Type.RESERVED_CONSOLE);
        this.parser(Type.SYMBOL_DOT);
        this.parser(Type.RESERVED_WRITE);

        this.translate += 'print';
        this.translate += this.preAnalysis.getValue();
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.printValue();

        this.translate += this.preAnalysis.getValue();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private printValue(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS
            || this.preAnalysis.getTypeToken() == Type.DIGIT
            || this.preAnalysis.getTypeToken() == Type.DECIMAL
            || this.preAnalysis.getTypeToken() == Type.ID
            || this.preAnalysis.getTypeToken() == Type.STR
            || this.preAnalysis.getTypeToken() == Type.CHARACTER
            || this.preAnalysis.getTypeToken() == Type.HTML
            || this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_AND
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_OR
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_NOT) {
            this.condition();
        } else if (this.preAnalysis.getTypeToken() == Type.HTML) {
            this.translate += this.preAnalysis.getValue();
            this.parser(Type.HTML);
        }
    }

    private ifStatement(): void {
        this.translate += this.preAnalysis.getValue() + ' ';
        this.parser(Type.RESERVED_IF);

        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);

        this.translate += ':\n';
        this.body();
        this.elseStatement();
    }

    private condition(): void {
        this.not();
        this.expression();
        this.conditionP();
    }

    private conditionP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_AND
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.operator();
            this.condition();
        }
    }

    private not(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_NOT) {
            this.translate += 'not ';
            this.parser(Type.SYMBOL_NOT);
        }
    }

    private operator(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_AND
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.logical();
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY) {
            this.relational();
        }
    }

    private logical(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_AND) {
            this.translate += 'and ';
            this.parser(Type.SYMBOL_AND);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.translate += 'or ';
            this.parser(Type.SYMBOL_OR);
        }
    }

    private relational(): void {
        this.translate += this.preAnalysis.getValue();
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN) {
            this.parser(Type.SYMBOL_GREATER_THAN);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN) {
            this.parser(Type.SYMBOL_LESS_THAN);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS) {
            this.parser(Type.SYMBOL_GREATER_THAN_OETS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN_OETS) {
            this.parser(Type.SYMBOL_LESS_THAN_OETS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON) {
            this.parser(Type.SYMBOL_COMPARISON);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY) {
            this.parser(Type.SYMBOL_INEQUALITY);
        }
    }

    private elseStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_ELSE) {
            this.parser(Type.RESERVED_ELSE);
            this.elseifStatement();
            this.translate += '\n';
            this.body();
            this.elseStatement();
        }
    }

    private elseifStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_IF) {
            this.translate += 'elif ';
            this.parser(Type.RESERVED_IF);
            this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
            this.condition();
            this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        } else {
            this.translate += 'else:';
        }
    }

    private switchStatement(): void {
        this.translate += 'def ' + this.preAnalysis.getValue() + ' ';
        this.parser(Type.RESERVED_SWITCH);

        this.translate += this.preAnalysis.getValue() + ' ';
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();

        this.translate += this.preAnalysis.getValue() + ':\n';
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);

        this.translate += 'switcher = ' + this.preAnalysis.getValue() + '\n';
        this.counterTabulations++;
        this.parser(Type.SYMBOL_LEFT_CURLY_BRACKET);

        this.caseStatement();
        this.defaultStatement();

        this.translate += this.preAnalysis.getValue() + '\n';
        this.parser(Type.SYMBOL_RIGHT_CURLY_BRACKET);
        this.counterTabulations--;
    }

    private caseStatement(): void {
        this.addIndentation();
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_CASE) {
            this.caseStatementP();
            this.caseStatement();
        }
    }

    private caseStatementP(): void {
        this.parser(Type.RESERVED_CASE);
        this.expression();

        this.translate += this.preAnalysis.getValue() + ' ';
        this.parser(Type.SYMBOL_COLON);

        this.instruction();
        this.translate += ',';
    }

    private defaultStatement(): void {
        this.addIndentation();
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_DEFAULT) {
            this.translate += this.preAnalysis.getValue();
            this.parser(Type.RESERVED_DEFAULT);

            this.translate += this.preAnalysis.getValue() + ' ';
            this.parser(Type.SYMBOL_COLON);

            this.instruction();
            this.translate += ',';
        }
    }

    /*private forStatement(): void {
        this.translate += this.preAnalysis.getValue() + ' a in range';
        this.parser(Type.RESERVED_FOR);

        this.translate += this.preAnalysis.getValue() + ' ';
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.initializer();
        this.condition();
        this.parser(Type.SYMBOL_SEMICOLON);
        this.iteratorAssignment();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.body();
    }*/

    private parser(type: Type): void {
        if (this.preAnalysis.getTypeToken() != Type.EOF) {
            this.index++;
            this.preAnalysis = this.tokenList[this.index];
        }
    }

    public addIndentation(): void {
        for (let i = 0; i < this.counterTabulations; i++) {
            for (let j = 0; j < 4; j++) {
                this.translate += " ";
            }
        }
    }

    public getTranslate(): string {
        return this.translate;
    }
};