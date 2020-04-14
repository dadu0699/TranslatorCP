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
        this.nextToken(); // RESERVED_CLASS
        this.nextToken(); // ID
        this.nextToken(); // SYMBOL_LEFT_CURLY_BRACKET
        this.bodyClass();
        this.nextToken(); // SYMBOL_RIGHT_CURLY_BRACKET
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
            this.translate += '\n';
            this.addIndentation();
            this.translate += this.preAnalysis.getValue().replace('//', '#').replace('\n', '');
            this.nextToken(); // COMMENT
        } else if (this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.translate += '\n';
            this.addIndentation();
            let comment: string = this.preAnalysis.getValue()
                .replace('\t', '')
                .replace('/*', '/*\n').replace('/*', '\'\'\'')
                .replace('*/', '\n*/').replace('*/', '\'\'\'');

            let splitComment: Array<string> = comment.split('\n');
            this.translate += splitComment[0] + '\n';
            for (let i = 1; i < (splitComment.length - 1); i++) {
                this.addIndentation();
                this.translate += '    ';
                this.translate += splitComment[i].trim();
                this.translate += '\n';
            }
            this.addIndentation();
            this.translate += splitComment[splitComment.length - 1].trim();

            this.nextToken(); // MULTILINE_COMMENT
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
        this.nextToken(); // ID
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

            this.translate += '\n';
            this.addIndentation();
            this.translate += 'def '
            this.translate += this.tokenList[this.index - 1].getValue();

            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // SYMBOL_LEFT_PARENTHESIS

            this.methodParameter();

            this.translate += this.preAnalysis.getValue() + ':';
            this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
            this.body();

            if (rMain) {
                this.translate += '\n';
                this.addIndentation();
                this.translate += 'if __name__ == "__main__":\n    main()'
            }
        }
    }

    private methodType(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_VOID) {
            this.nextToken(); // RESERVED_VOID
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.type();
        }
    }

    private type(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.nextToken();
            /*  RESERVED_INT
                RESERVED_STRING
                RESERVED_DOUBLE
                RESERVED_BOOL
                RESERVED_CHAR
            */
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
        this.nextToken() // ID
        this.parameterP();
    }

    private parameterP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {
            this.translate += this.preAnalysis.getValue() + ' ';
            this.nextToken(); // SYMBOL_COMMA
            this.parameter();
        }
    }

    private body(): void {
        this.counterTabulations++;
        this.nextToken(); // SYMBOL_LEFT_CURLY_BRACKET
        this.instruction();
        this.nextToken(); // SYMBOL_RIGHT_CURLY_BRACKET
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
            this.forStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_WHILE) {
            this.whileStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_DO) {
            this.doStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_RETURN) {
            this.returnStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_BREAK) {
            this.breakStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_CONTINUE) {
            this.continueStatement();
        } else if (this.preAnalysis.getTypeToken() == Type.COMMENT
            || this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.commentary();
        }
    }

    private declaration(): void {
        this.translate += '\n';
        this.addIndentation();
        this.type();
        this.idList();
        this.nextToken(); // SYMBOL_SEMICOLON
    }

    private idList(): void {
        this.nextToken(); // ID
        this.assignVariable();
        if (this.tokenList[this.index - 2].getTypeToken() == Type.SYMBOL_EQUALS
            && this.tokenList[this.index].getTypeToken() != Type.SYMBOL_SEMICOLON) {
            this.translate += '\n';
            this.addIndentation();
        }
        this.idListP();
    }

    private idListP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {
            this.nextToken(); // SYMBOL_COMMA
            this.idList();
        }
    }

    private assignVariable(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_EQUALS) {
            this.translate += this.tokenList[this.index - 1].getValue() + ' ';
            this.translate += this.preAnalysis.getValue() + ' ';
            this.nextToken(); // SYMBOL_EQUALS
            this.expression();
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.iterator();
        }
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
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS) {
            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
            this.expression();
            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        } else if (this.preAnalysis.getTypeToken() == Type.DIGIT
            || this.preAnalysis.getTypeToken() == Type.DECIMAL
            || this.preAnalysis.getTypeToken() == Type.STR
            || this.preAnalysis.getTypeToken() == Type.CHARACTER
            || this.preAnalysis.getTypeToken() == Type.HTML) {
            this.translate += this.preAnalysis.getValue();
            this.nextToken();
            /*
                DIGIT 
                DECIMAL 
                STR 
                CHARACTER 
                HTML 
            */
        } else if (this.preAnalysis.getTypeToken() == Type.ID) {
            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // ID
            this.invokeMethod();
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE) {
            this.translate += 'True';
            this.nextToken(); // TRUE
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
            this.translate += 'False';
            this.nextToken(); // FALSE
        }
    }

    private invokeMethod(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS) {
            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
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
            this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        }
    }

    private invokeMethodP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {
            this.translate += this.preAnalysis.getValue() + ' ';
            this.nextToken(); // SYMBOL_COMMA
            this.expression();
            this.invokeMethodP();
        }
    }

    private arithmetic(): void {
        this.translate += ' ' + this.preAnalysis.getValue() + ' ';
        this.nextToken();
        /*  SYMBOL_PLUS
            SYMBOL_MINUS 
            SYMBOL_MULTIPLICATION 
            SYMBOL_DIVISION
        */
    }

    private iterator(): void {
        this.translate += this.tokenList[this.index - 1].getValue() + ' ';
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT) {
            this.translate += '+= 1';
            this.nextToken(); // SYMBOL_INCREMENT
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.translate += '-= 1';
            this.nextToken(); // SYMBOL_DECREMENT
        }
    }

    private assignment(): void {
        this.translate += '\n';
        this.addIndentation();
        this.nextToken(); // ID
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_EQUALS ||
            this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.assignVariable();
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS) {
            this.translate += this.tokenList[this.index - 1].getValue();
            this.invokeMethod();
        }
        this.nextToken(); // SYMBOL_SEMICOLON
    }

    private printStatement(): void {
        this.nextToken(); // RESERVED_CONSOLE
        this.nextToken(); // SYMBOL_DOT
        this.nextToken(); // RESERVED_WRITE

        this.translate += '\n';
        this.addIndentation();
        this.translate += 'print';
        this.translate += this.preAnalysis.getValue();
        this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
        this.printValue();

        this.translate += this.preAnalysis.getValue();
        this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        this.nextToken(); // SYMBOL_SEMICOLON
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
            this.nextToken(); // HTML
        }
    }

    private ifStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue() + ' ';
        this.nextToken(); // RESERVED_IF

        this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
        this.condition();
        this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS

        this.translate += ':';
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
            this.translate += ' not ';
            this.nextToken(); // SYMBOL_NOT
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
            this.translate += ' and ';
            this.nextToken(); // SYMBOL_AND
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.translate += ' or ';
            this.nextToken(); // SYMBOL_OR
        }
    }

    private relational(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_LESS_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY) {
            this.translate += ' ' + this.preAnalysis.getValue() + ' ';
            this.nextToken();
            /*  SYMBOL_GREATER_THAN 
                SYMBOL_LESS_THAN 
                SYMBOL_GREATER_THAN_OETS
                SYMBOL_LESS_THAN_OETS
                SYMBOL_COMPARISON
                SYMBOL_INEQUALITY
            */
        }
    }

    private elseStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_ELSE) {
            this.nextToken(); // RESERVED_ELSE
            this.elseifStatement();
            this.body();
            this.elseStatement();
        }
    }

    private elseifStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_IF) {
            this.translate += 'elif ';
            this.nextToken(); // RESERVED_IF
            this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
            this.condition();
            this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        } else {
            this.translate += 'else:';
        }
    }

    private switchStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += 'def ' + this.preAnalysis.getValue();
        this.nextToken(); // RESERVED_SWITCH
        this.translate += this.preAnalysis.getValue() + 'case, ';
        this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
        this.condition();
        this.translate += this.preAnalysis.getValue();
        this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        this.counterTabulations++;
        this.nextToken(); // SYMBOL_LEFT_CURLY_BRACKET

        this.translate += '\n';
        this.addIndentation();
        this.translate += 'switcher = {';
        this.counterTabulations++;
        this.caseStatement();
        this.defaultStatement();

        this.counterTabulations--;
        this.translate += '\n';
        this.addIndentation();
        this.translate += '}';
        this.nextToken(); // SYMBOL_RIGHT_CURLY_BRACKET
        this.counterTabulations--;
    }

    private caseStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_CASE) {
            this.caseStatementP();
            this.caseStatement();
        }
    }

    private caseStatementP(): void {
        this.translate += '\n';
        this.addIndentation();
        this.nextToken(); // RESERVED_CASE
        this.expression();
        this.translate += this.preAnalysis.getValue() + ' ';
        this.nextToken(); // SYMBOL_COLON
        this.counterTabulations++;
        this.instruction();
        this.translate += ',';
        this.counterTabulations--;
    }

    private defaultStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_DEFAULT) {
            this.translate += '\n';
            this.addIndentation();
            this.translate += this.preAnalysis.getValue();
            this.nextToken(); // RESERVED_DEFAULT
            this.translate += this.preAnalysis.getValue() + ' ';
            this.nextToken(); // SYMBOL_COLON
            this.counterTabulations++;
            this.instruction();
            this.translate += ',';
            this.counterTabulations--;
        }
    }

    private forStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue();
        this.nextToken(); // RESERVED_FOR
        this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
        this.initializerCondition();
        this.iteratorAssignment();
        this.nextToken(); //SYMBOL_RIGHT_PARENTHESIS
        this.body();
    }

    private initializerCondition(): void {
        let eval1: string = '';
        let eval2: string = '';
        let operator: Token;

        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.type();
        }
        this.translate += ' ' + this.preAnalysis.getValue() + ' in range (';

        this.nextToken(); // ID
        this.nextToken(); // SYMBOL_EQUALS
        while (this.preAnalysis.getTypeToken() != Type.SYMBOL_SEMICOLON) {
            eval1 += this.preAnalysis.getValue(); // EXPRESSION
            this.nextToken();
        }
        this.nextToken(); // SYMBOL_SEMICOLON

        this.nextToken(); // ID
        operator = this.preAnalysis;
        this.nextToken(); // OPERATOR
        while (this.preAnalysis.getTypeToken() != Type.SYMBOL_SEMICOLON) {
            eval2 += this.preAnalysis.getValue(); // EXPRESSION
            this.nextToken();
        }
        this.nextToken(); // SYMBOL_SEMICOLON

        if (operator.getTypeToken() == Type.SYMBOL_LESS_THAN_OETS) {
            eval2 = (Number(eval2) + 1).toString();
        } else if (operator.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS) {
            eval1 = (Number(eval1) + 1).toString();
        }

        this.translate += eval1 + ', ' + eval2 + ', ';
    }

    private iteratorAssignment(): void {
        this.nextToken(); // ID
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT) {
            this.translate += '1';
            this.nextToken(); // SYMBOL_INCREMENT
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.translate += '-1';
            this.nextToken(); // SYMBOL_DECREMENT
        }
        this.translate += '):';
    }

    private whileStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue() + ' ';
        this.nextToken(); // RESERVED_WHILE
        this.nextToken(); // SYMBOL_LEFT_PARENTHESIS
        this.condition();
        this.nextToken(); // SYMBOL_RIGHT_PARENTHESIS
        this.translate += ':';
        this.body();
    }

    private doStatement(): void {
        this.nextToken() // RESERVED_DO
        this.translate += '\n';
        this.addIndentation();
        this.translate += 'while True:';
        this.body();
        this.nextToken() // RESERVED_WHILE
        this.nextToken() // SYMBOL_LEFT_PARENTHESIS
        this.counterTabulations++;
        this.translate += '\n';
        this.addIndentation();
        this.translate += 'if ';
        this.condition();
        this.translate += ':';
        this.counterTabulations++;
        this.translate += '\n';
        this.addIndentation();
        this.translate += 'break';
        this.counterTabulations -= 2;
        this.nextToken() // SYMBOL_RIGHT_PARENTHESIS
        this.nextToken() // Type.SYMBOL_SEMICOLON
    }

    private returnStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue() + ' ';
        this.nextToken() // RESERVED_RETURN
        this.returnStatementP();
        this.nextToken() // SYMBOL_SEMICOLON
    }

    private returnStatementP(): void {
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
        }
    }

    private breakStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue();
        this.nextToken() // RESERVED_BREAK
        this.nextToken() // SYMBOL_SEMICOLON
    }

    private continueStatement(): void {
        this.translate += '\n';
        this.addIndentation();
        this.translate += this.preAnalysis.getValue();
        this.nextToken() // RESERVED_CONTINUE
        this.nextToken() // SYMBOL_SEMICOLON
    }

    private nextToken(): void {
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
        if (this.translate[0] == '\n') {
            this.translate = this.translate.substring(1);
        }
        return this.translate;
    }
};