const http = require('http');
const mysql = require('mysql2');

class Server {
    constructor() {
        this.config = {
            host: "mysql",
            user: "root",
            password: "root",
            database: "nodeapp"
        };
        this.names = ['marcos', 'joao', 'claudio', 'pedro'];
        this.connection = null;
        this.result = null;
    }

    async queryAsync(sql, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async validadetable() {
        try {
            const result = await this.queryAsync("SHOW TABLES LIKE ?", ['%people%']);
            return result.length > 0;
        } catch (error) {
            console.error('Ocorreu um erro:', error);
            return false;
        }
    }

    async createtable() {
        if (!await this.validadetable()) {
            var sql = "CREATE TABLE people (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(250))";
            await this.queryAsync(sql);
        }
    }

    async insertnames() {
        await this.createtable();
        var sql = "INSERT INTO people (name) VALUES ?";
        await this.queryAsync(sql, [this.names.map(name => [name])]);
    }

    async selectnames() {
        await this.insertnames();
        var sql = "SELECT * FROM people";
        const result = await this.queryAsync(sql);
        this.result = result;
    }

    async createConnect() {
        try {
            this.connection = mysql.createConnection(this.config);
            await this.connection.promise().connect();
            await this.createtable();
            return true;
        } catch (error) {
            console.error('Ocorreu um erro ao conectar:', error);
            return false;
        }
    }

    async retornahttp() {
        if (await this.createConnect()) {
            const hostname = '0.0.0.0';
            const port = 3000;

            const server = http.createServer(async (req, res) => {
                await this.selectnames();
                res.statusCode = 200;
                //res.setHeader('Content-Type', 'text/plain');
                var formattedStrings = ''
                this.result.forEach(item => {
                    formattedStrings += `${'<h2>'+item.id} - Nome: ${item.name+'</h1>'}\n`;
                    console.log(formattedStrings);
                });
                res.end("<h1>Full Cycle Rocks!</h1>" + formattedStrings);
            });

            server.listen(port, hostname, () => {
                console.log('Servidor rodando em http://${hostname}:${port}/');
            });
        }
    }
}

const serverapp = new Server();
serverapp.retornahttp();