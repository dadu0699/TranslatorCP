import { TokenHTML } from 'src/app/model/TokenHTML';
import { Type } from 'src/app/model/TokenHTML';

export class PrettierHTML {
    private index: number;
    private preAnalysis: TokenHTML;
    private tokenList: Array<TokenHTML>;
    private htmlContent: string;
    private translate: string;
    private counterTabulations: number;
    private counterTags: number;

    constructor(tokenList: Array<TokenHTML>) {
        this.tokenList = [];
        this.cloneTokenList(tokenList);

        this.htmlContent = '';
        this.counterTags = 0;
        this.prettier();

        this.index = 0;
        this.translate = '';
        this.preAnalysis = this.tokenList[0];
        this.counterTabulations = 0;

        this.tokenList.push(new TokenHTML(null, null, null, Type.EOF, null));
        this.start();
    }

    private cloneTokenList(tokenList: Array<TokenHTML>) {
        tokenList.forEach(element => {
            this.tokenList.push(element);
        });
    }

    private prettier(): void {
        this.tokenList.forEach(element => {
            if (element.getTypeToken() == Type.HTML_CLOSING_TAG
                || element.getTypeToken() == Type.HEAD_CLOSING_TAG
                || element.getTypeToken() == Type.BODY_CLOSING
                || element.getTypeToken() == Type.TITLE_CLOSING_TAG
                || element.getTypeToken() == Type.DIV_CLOSING_TAG
                || element.getTypeToken() == Type.P_CLOSING_TAG
                || element.getTypeToken() == Type.H1_CLOSING_TAG
                || element.getTypeToken() == Type.BUTTON_CLOSING_TAG
                || element.getTypeToken() == Type.LABEL_CLOSING_TAG) {
                this.counterTags--;
            }

            this.addIndentationHTML();
            this.htmlContent += element.getValue() + '\n';

            if (element.getTypeToken() == Type.HTML_TAG
                || element.getTypeToken() == Type.HEAD_TAG
                || element.getTypeToken() == Type.BODY_TAG
                || element.getTypeToken() == Type.TITLE_TAG
                || element.getTypeToken() == Type.DIV_TAG
                || element.getTypeToken() == Type.P_TAG
                || element.getTypeToken() == Type.H1_TAG
                || element.getTypeToken() == Type.BUTTON_TAG
                || element.getTypeToken() == Type.LABEL_TAG) {
                this.counterTags++;
            }
        });
    }

    private addIndentationHTML(): void {
        for (let i = 0; i < this.counterTags; i++) {
            this.htmlContent += '\t';
        }
    }

    private start(): void {
        this.doctype();
        this.translate += '"HTML": {\n';
        this.counterTabulations++;
        this.nextToken(); // HTML OPENING TAG
        this.head();
        this.body();
        this.translate += '}\n';
        this.counterTabulations--;
        this.nextToken(); // HTML CLOSING TAG
    }

    private doctype(): void {
        if (this.preAnalysis.getTypeToken() == Type.DOCTYPE_TAG) {
            this.nextToken(); // DOCTYPE TAG
        }
    }

    private head(): void {
        if (this.preAnalysis.getTypeToken() == Type.HEAD_TAG) {
            this.addIndentationJSON();
            this.translate += '"HEAD": {\n';
            this.counterTabulations++;
            this.nextToken(); // HEAD OPENING TAG
            this.title();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // HEAD CLOSING TAG
        }
    }

    private title(): void {
        if (this.preAnalysis.getTypeToken() == Type.TITLE_TAG) {
            this.addIndentationJSON();
            this.translate += '"TITLE": {\n';
            this.counterTabulations++;
            this.nextToken(); // TITLE OPENING TAG
            this.content();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '}\n';
            this.nextToken(); // HEAD CLOSING TAG
        }
    }

    private content(): void {
        if (this.preAnalysis.getTypeToken() == Type.CONTENT) {
            this.addIndentationJSON();
            this.translate += '"TEXT": "' + this.preAnalysis.getValue() + '"\n';
            this.nextToken(); // CONTENT
        }
    }

    private body(): void {
        if (this.preAnalysis.getTypeToken() == Type.BODY_TAG) {
            this.addIndentationJSON();
            this.translate += '"BODY": {\n';
            this.counterTabulations++;
            if (this.preAnalysis.getValue() === '<body style="background:yellow">'
                || this.preAnalysis.getValue() === '<body style="background:green">'
                || this.preAnalysis.getValue() === '<body style="background:blue">'
                || this.preAnalysis.getValue() === '<body style="background:red">'
                || this.preAnalysis.getValue() === '<body style="background:white">'
                || this.preAnalysis.getValue() === '<body style="background:skyblue">') {
                this.addIndentationJSON();
                let style: string = this.preAnalysis.getValue().split('=')[1]
                this.translate += '"STYLE": ' + style.substring(0, style.length - 1) + ',\n';
            }
            this.nextToken(); // BODY OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '}\n';
            this.nextToken(); // BODY CLOSING TAG
        }
    }

    private instruction(): void {
        if (this.preAnalysis.getTypeToken() == Type.DIV_TAG
            || this.preAnalysis.getTypeToken() == Type.BR_TAG
            || this.preAnalysis.getTypeToken() == Type.P_TAG
            || this.preAnalysis.getTypeToken() == Type.H1_TAG
            || this.preAnalysis.getTypeToken() == Type.BUTTON_TAG
            || this.preAnalysis.getTypeToken() == Type.LABEL_TAG
            || this.preAnalysis.getTypeToken() == Type.INPUT_TAG
            || this.preAnalysis.getTypeToken() == Type.CONTENT) {
            this.instructionP();
            this.instruction();
        }
    }

    private instructionP(): void {
        if (this.preAnalysis.getTypeToken() == Type.DIV_TAG) {
            this.addIndentationJSON();
            this.translate += '"DIV": {\n';
            this.counterTabulations++;
            if (this.preAnalysis.getValue() === '<div style="background:yellow">'
                || this.preAnalysis.getValue() === '<div style="background:green">'
                || this.preAnalysis.getValue() === '<div style="background:blue">'
                || this.preAnalysis.getValue() === '<div style="background:red">'
                || this.preAnalysis.getValue() === '<div style="background:white">'
                || this.preAnalysis.getValue() === '<div style="background:skyblue">') {
                this.addIndentationJSON();
                let style: string = this.preAnalysis.getValue().split('=')[1]
                this.translate += '"STYLE": ' + style.substring(0, style.length - 1) + ',\n';
            }
            this.nextToken(); // DIV OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // DIV CLOSING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.BR_TAG) {
            this.addIndentationJSON();
            this.translate += '"BR": "\\n",\n';
            this.nextToken(); // BR OPENING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.P_TAG) {
            this.addIndentationJSON();
            this.translate += '"P": {\n';
            this.counterTabulations++;
            this.nextToken(); // P OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // P CLOSING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.H1_TAG) {
            this.addIndentationJSON();
            this.translate += '"H1": {\n';
            this.counterTabulations++;
            this.nextToken(); // H1 OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // H1 CLOSING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.BUTTON_TAG) {
            this.addIndentationJSON();
            this.translate += '"BUTTON": {\n';
            this.counterTabulations++;
            this.nextToken(); // BUTTON OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // H1 CLOSING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.LABEL_TAG) {
            this.addIndentationJSON();
            this.translate += '"LABEL": {\n';
            this.counterTabulations++;
            this.nextToken(); // LABEL OPENING TAG
            this.instruction();
            this.counterTabulations--;
            this.addIndentationJSON();
            this.translate += '},\n';
            this.nextToken(); // H1 CLOSING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.INPUT_TAG) {
            this.addIndentationJSON();
            this.translate += '"IMPUT",\n';
            this.nextToken(); // INPUT OPENING TAG
        } else if (this.preAnalysis.getTypeToken() == Type.CONTENT) {
            this.addIndentationJSON();
            this.translate += '"TEXT": "' + this.preAnalysis.getValue() + '",\n';
            this.nextToken(); // CONTENT OPENING TAG
        }
    }

    private nextToken(): void {
        if (this.preAnalysis.getTypeToken() != Type.EOF) {
            this.index++;
            this.preAnalysis = this.tokenList[this.index];
        }
    }

    private addIndentationJSON(): void {
        for (let i = 0; i < this.counterTabulations; i++) {
            this.translate += '\t';
        }
    }

    public getHTMLContent(): string {
        return this.htmlContent;
    }

    public getTranslate(): string {
        return this.translate;
    }
}