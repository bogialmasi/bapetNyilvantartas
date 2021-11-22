const http = require('http');
const fs = require('fs');
const port = 4446;

const server = http.createServer((req, res)=>{
    console.log(req.url + "\t" + req.method);

    switch(true){
        case req.url === "/" && req.method === "GET":
            fs.readFile("./views/index.html", (err, file)=>{
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "/nyilvantartas" && req.method === "GET":
            fs.readFile("./data/nyilvantartas.json", (err, file) => {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "/script.js" && req.method === 'GET':
            fs.readFile('./public/script.js', (err, file) => {
                res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "ujnyilvantartas" && req.method === "POST":
            let data = "";
            res.writeHead(200);
            req.on('data', chunk => {data += chunk;})
            req.on('end', () => {
                fs.readFile("./data/nyilvantartas.json", (err, file) => {
                    if(err){throw err;}
                    console.log("file beolvasva!");
                    var fileParsedJson = JSON.parse(file);
                    console.log("file parsed: " +  fileParsedJson);
                    dataParsedJson = JSON.parse(data);
                    validateInput(dataParsedJson);

                    var sanitizedData = sanitizedBody(dataParsedJson);
                    fileParsedJson.push(JSON.parse(sanitizedData));
                    console.log("push done!");

                    fs.writeFile("./data/nyilvantartas.json", JSON.stringify(fileParsedJson), (err) =>{
                        if(err){console.log(err);}
                        console.log(data + "\nSAVED!");
                    });
                });
                res.end(data);
            })
            break;
        default:
            fs.readFile("./views/error.html", (err, file) =>{
                res.setHeader('Content-Type', 'text/html;charser=UTF-8');
                res.writeHead(200, err);
                res.end(file)
            });
            break;
        
    }
});

function sanitizedBody(body) {
    var count = 0;
    var sanitized = "{";
    for(var key in body) {
        sanitized += "\"" +sanitizeString(key)+"\" : ";
        sanitized += "\"" +sanitizeString(body[key])+"\"";
        count++;
        if (Object.keys(body).length !== count){
            sanitized+=",";
        }
    }

    sanitized +="}";
    console.log(sanitized);
    return sanitized;
}

function validateInput(input){
    if(input["megnevezes"].length > 200){
        throw new Error("Túl hosszú szöveg!!!");
    }
    if((input["tipus"] !== 1) && (input["tipus"] !== 2))
    {throw new Error("Nem megfelelő típus!!!");}
}

server.listen(port);