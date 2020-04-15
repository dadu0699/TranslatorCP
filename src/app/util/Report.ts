import { Token } from 'src/app/model/Token';
import { Error } from 'src/app/model/Error';

export class Report {
    private fileContent: string;

    constructor() {
    }

    private header(): void {
        this.fileContent = '';
        this.fileContent += '<!doctype html>';
        this.fileContent += '<html lang=\"es\">';
        this.fileContent += '<head>';
        this.fileContent += '<meta charset=\"utf - 8\">';
        this.fileContent += '<meta name=\"viewport\" content=\"width = device - width, initial - scale = 1, shrink - to - fit = no\">';
        this.fileContent += '<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css\">';
        this.fileContent += '<link rel=\"stylesheet\" href=\"https://cdn.datatables.net/1.10.20/css/dataTables.bootstrap4.min.css\">';
    }

    private footer(): void {
        this.fileContent += '<script src=\"https://code.jquery.com/jquery-3.3.1.js\"></script>';
        this.fileContent += '<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\"></script>';
        this.fileContent += '<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\"></script>';
        this.fileContent += '<script src=\"https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js\"></script>';
        this.fileContent += '<script src=\"https://cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js\"></script>';
        this.fileContent += '<script> $(document).ready(function () {$(\'#example\').DataTable();});</script>';
        this.fileContent += '</body>';
        this.fileContent += '</html>';
    }

    public generateTokenReport(tokenList: Array<Token>): void {
        this.header();
        this.fileContent += '<title>Tokens</title>';
        this.fileContent += '</head>';
        this.fileContent += '<body>';
        this.fileContent += '<div class=\"container\"><br>';
        this.fileContent += '<h1>Tokens List</h1><hr>';
        this.fileContent += '<table id=\"example\" class=\"table table - striped table - bordered\" style=\"width: 100 % \">';
        this.fileContent += '<thead><tr><th>#</th><th>Lexeme</th><th>Type</th><th>Row</th><th>Column</th></tr></thead>';
        this.fileContent += '<tbody>';

        tokenList.forEach(item => {
            this.fileContent += '<tr>';
            this.fileContent += '<th>' + item.getIDToken() + '</th>';
            this.fileContent += '<th>' + item.getValue()
                .replace('<', '&lt;').replace('>', '&gt;') + '</th>';
            this.fileContent += '<th>' + item.getTypeToken() + '</th>';
            this.fileContent += '<th>' + item.getRow() + '</th>';
            this.fileContent += '<th>' + item.getColumn() + '</th>';
            this.fileContent += '</tr>';
        });

        this.fileContent += '</tbody>';
        this.fileContent += '</table>';
        this.fileContent += '</div>';

        this.footer();

        this.writeContent(this.fileContent, 'tokenList.html', 'text/html');
    }

    public generateErrorReport(errorList: Array<Error>): void {
        this.header();
        this.fileContent += '<title>Errors</title>';
        this.fileContent += '</head>';
        this.fileContent += '<body>';
        this.fileContent += '<div class=\"container\"><br>';
        this.fileContent += '<h1>List of Errors</h1><hr>';
        this.fileContent += '<table id=\"example\" class=\"table table - striped table - bordered\" style=\"width: 100 % \">';
        this.fileContent += '<thead><tr><th>#</th><th>Error</th><th>Type</th><th>Description</th><th>Row</th><th>Column</th></tr></thead>';
        this.fileContent += '<tbody>';

        errorList.forEach(item => {
            this.fileContent += '<tr>';
            this.fileContent += '<th>' + item.getIDError() + '</th>';
            this.fileContent += '<th>' + item.getType() + '</th>';
            this.fileContent += '<th>' + item.getCharacter()
                .replace('<', '&lt;').replace('>', '&gt;') + '</th>';
            this.fileContent += '<th>' + item.getDescription() + '</th>';
            this.fileContent += '<th>' + item.getRow() + '</th>';
            this.fileContent += '<th>' + item.getColumn() + '</th>';
            this.fileContent += '</tr>';
        });

        this.fileContent += '</tbody>';
        this.fileContent += '</table>';
        this.fileContent += '</div>';

        this.footer();

        this.writeContent(this.fileContent, 'errorList.html', 'text/html');
    }

    public writeContent(content, fileName, contentType): void {
        var a = document.createElement('a');
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
};