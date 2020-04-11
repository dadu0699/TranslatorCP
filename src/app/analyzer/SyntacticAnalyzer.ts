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
            this.parser(Type.COMMENT);
        } else if (this.preAnalysis.getTypeToken() == Type.MULTILINE_COMMENT) {
            this.parser(Type.MULTILINE_COMMENT);
        }
        else {
            this.addError('Was expected \'Single Line Comment | Multiline Comment\'');
            this.syntacticError = true;
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
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.methodParameter();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.body();
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
        } else {
            this.addError('Was expected \'type of method\'');
            this.syntacticError = true;
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
        } else {
            this.addError('Was expected \'string | int | double | bool | char\'');
            this.syntacticError = true;
        }
    }

    private methodParameter(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.parameter();
        }
    }

    private parameter(): void {
        this.type();
        this.parser(Type.ID);
        this.parameterP();
    }

    private parameterP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_COMMA) {
            this.parser(Type.SYMBOL_COMMA);
            this.parameter();
        }
    }

    private body(): void {
        this.parser(Type.SYMBOL_LEFT_CURLY_BRACKET);
        this.instruction();
        this.parser(Type.SYMBOL_RIGHT_CURLY_BRACKET);
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
        this.type();
        this.idList();
        this.assignVariable();
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private idList(): void {
        this.parser(Type.ID);
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
            this.parser(Type.SYMBOL_EQUALS);
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
            this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
            this.expression();
            this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        } else if (this.preAnalysis.getTypeToken() == Type.DIGIT) {
            this.parser(Type.DIGIT);
        } else if (this.preAnalysis.getTypeToken() == Type.DECIMAL) {
            this.parser(Type.DECIMAL);
        } else if (this.preAnalysis.getTypeToken() == Type.ID) {
            this.parser(Type.ID);
        } else if (this.preAnalysis.getTypeToken() == Type.STR) {
            this.parser(Type.STR);
        } else if (this.preAnalysis.getTypeToken() == Type.CHARACTER) {
            this.parser(Type.CHARACTER);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE) {
            this.parser(Type.RESERVED_TRUE);
        } else if (this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
            this.parser(Type.RESERVED_FALSE);
        } else {
            this.addError('Was expected \'( | digit | decimal | ID | string | char | true | false\'');
            this.syntacticError = true;
        }
    }

    private arithmetic(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_PLUS) {
            this.parser(Type.SYMBOL_PLUS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_MINUS) {
            this.parser(Type.SYMBOL_MINUS);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_MULTIPLICATION) {
            this.parser(Type.SYMBOL_MULTIPLICATION);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DIVISION) {
            this.parser(Type.SYMBOL_DIVISION);
        } else {
            this.addError('Was expected \'+ | - | * | /\'');
            this.syntacticError = true;
        }
    }

    private iterator(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_INCREMENT) {
            this.parser(Type.SYMBOL_INCREMENT);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_DECREMENT) {
            this.parser(Type.SYMBOL_DECREMENT);
        } else {
            this.addError('Was expected \'++ | --\'');
            this.syntacticError = true;
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
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.printValue();
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
            || this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
            this.expression();
        } else if (this.preAnalysis.getTypeToken() == Type.HTML) {
            this.parser(Type.HTML);
        } else {
            this.addError('Was expected \'EXPRESSION | HTML\'');
            this.syntacticError = true;
        }
    }

    private ifStatement(): void {
        this.parser(Type.RESERVED_IF);
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
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
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_AND
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.operator();
            this.expression();
        }
    }

    private not(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_NOT) {
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
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_GREATER_THAN_OETS
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_COMPARISON
            || this.preAnalysis.getTypeToken() == Type.SYMBOL_INEQUALITY) {
            this.relational();
        }
    }

    private logical(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_AND) {
            this.parser(Type.SYMBOL_AND);
        } else if (this.preAnalysis.getTypeToken() == Type.SYMBOL_OR) {
            this.parser(Type.SYMBOL_OR);
        } else {
            this.addError('Was expected \'&& | ||\'');
            this.syntacticError = true;
        }
    }

    private relational(): void {
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
        } else {
            this.addError('Was expected \'> | < | >= | <= | == | !=\'');
            this.syntacticError = true;
        }
    }

    private elseStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_ELSE) {
            this.parser(Type.RESERVED_ELSE);
            this.elseifStatement();
            this.body();
            this.elseStatement();
        }
    }

    private elseifStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_IF) {
            this.parser(Type.RESERVED_IF);
        }
    }

    private switchStatement(): void {
        this.parser(Type.RESERVED_SWITCH);
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.parser(Type.SYMBOL_LEFT_CURLY_BRACKET);
        this.caseStatement();
        this.defaultStatement();
        this.parser(Type.SYMBOL_RIGHT_CURLY_BRACKET);
    }

    private caseStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_CASE) {
            this.caseStatementP();
            this.caseStatement();
        }
    }

    private caseStatementP(): void {
        this.parser(Type.RESERVED_CASE);
        this.expression();
        this.parser(Type.SYMBOL_COLON);
        this.instruction();
    }

    private defaultStatement(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_DEFAULT) {
            this.parser(Type.RESERVED_DEFAULT);
            this.parser(Type.SYMBOL_COLON);
            this.instruction();
        }
    }

    private forStatement(): void {
        this.parser(Type.RESERVED_FOR);
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.initializer();
        this.condition();
        this.parser(Type.SYMBOL_SEMICOLON);
        this.iteratorAssignment();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.body();
    }

    private initializer(): void {
        if (this.preAnalysis.getTypeToken() == Type.RESERVED_INT
            || this.preAnalysis.getTypeToken() == Type.RESERVED_STRING
            || this.preAnalysis.getTypeToken() == Type.RESERVED_DOUBLE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_BOOL
            || this.preAnalysis.getTypeToken() == Type.RESERVED_CHAR) {
            this.declaration();
        } else if (this.preAnalysis.getTypeToken() == Type.ID) {
            this.assignment();
        } else {
            this.addError('Was expected \'DECLARATION | ASSIGNMENT\'');
            this.syntacticError = true;
        }
    }

    private iteratorAssignment(): void {
        this.parser(Type.ID);
        this.iterator();
    }

    private whileStatement(): void {
        this.parser(Type.RESERVED_WHILE);
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.body();
    }

    private doStatement(): void {
        this.parser(Type.RESERVED_DO);
        this.body();
        this.parser(Type.RESERVED_WHILE);
        this.parser(Type.SYMBOL_LEFT_PARENTHESIS);
        this.condition();
        this.parser(Type.SYMBOL_RIGHT_PARENTHESIS);
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private returnStatement(): void {
        this.parser(Type.RESERVED_RETURN);
        this.returnStatementP();
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private returnStatementP(): void {
        if (this.preAnalysis.getTypeToken() == Type.SYMBOL_LEFT_PARENTHESIS
            || this.preAnalysis.getTypeToken() == Type.DIGIT
            || this.preAnalysis.getTypeToken() == Type.DECIMAL
            || this.preAnalysis.getTypeToken() == Type.ID
            || this.preAnalysis.getTypeToken() == Type.STR
            || this.preAnalysis.getTypeToken() == Type.CHARACTER
            || this.preAnalysis.getTypeToken() == Type.RESERVED_TRUE
            || this.preAnalysis.getTypeToken() == Type.RESERVED_FALSE) {
            this.expression();
        }
    }

    private breakStatement(): void {
        this.parser(Type.RESERVED_BREAK);
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private continueStatement(): void {
        this.parser(Type.RESERVED_RETURN);
        this.parser(Type.SYMBOL_SEMICOLON);
    }

    private parser(type: Type): void {
        if (this.index < this.tokenList.length - 1) {
            console.log(this.preAnalysis.getValue());
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
                    this.addError(this.preAnalysis.getValue() + ' Was expected \'' + type + '\'');
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

    public getErrorList(): Array<Error> {
        return this.errorList;
    }
};