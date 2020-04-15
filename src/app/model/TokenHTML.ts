export enum Type {
    DOCTYPE_TAG = 'DOCTYPE TAG',
    HTML_TAG = 'HTML OPENING TAG',
    HTML_CLOSING_TAG = 'HTML CLOSING TAG',
    HEAD_TAG = 'HEAD OPENING TAG',
    HEAD_CLOSING_TAG = 'HEAD CLOSING TAG',
    BODY_TAG = 'BODY OPENING TAG',
    BODY_CLOSING = 'BODY CLOSING TAG',
    TITLE_TAG = 'TITLE OPENING TAG',
    TITLE_CLOSING_TAG = 'TITLE CLOSING TAG',
    DIV_TAG = 'DIV OPENING TAG',
    DIV_CLOSING_TAG = 'DIV CLOSING TAG',
    BR_TAG = 'BR TAG',
    P_TAG = 'P OPENING TAG',
    P_CLOSING_TAG = 'P CLOSING TAG',
    H1_TAG = 'H1 OPENING TAG',
    H1_CLOSING_TAG = 'H1 CLOSING TAG',
    BUTTON_TAG = 'BUTTON OPENING TAG',
    BUTTON_CLOSING_TAG = 'BUTTON CLOSING TAG',
    LABEL_TAG = 'LABEL OPENING TAG',
    LABEL_CLOSING_TAG = 'LABEL CLOSING TAG',
    INPUT_TAG = 'INPUT TAG',
    ATTRIBUTE_STYLE = 'ATTRIBUTE STYLE',
    BACKGROUND_STYLE = 'BACKGROUND STYLE',
    YELLOW_COLOR = 'YELLOW COLOR',
    GREEN_COLOR = 'GREEN COLOR',
    BLUE_COLOR = 'BLUE COLOR',
    RED_COLOR = 'RED COLOR',
    WHITE_COLOR = 'WHITE COLOR',
    SKYBLUE_COLOR = 'SKYBLUE COLOR',
    CONTENT = 'CONTENT',
    EOF = 'END OF FILE'
};

export class TokenHTML {
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
};