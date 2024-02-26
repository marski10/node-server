const http = require('http');

class health {
    async retornahttp() {
   
            const hostname = '0.0.0.0';
            const portHealth = 3001;
            const healthServer = http.createServer((req, res) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Health Check: OK');
            });
            healthServer.listen(portHealth, hostname, () => {
                console.log(`Health check rodando em http://${hostname}:${portHealth}/`);
            });
        }
    }


// Exemplo de uso
const suaInstancia = new health();
suaInstancia.retornahttp();
