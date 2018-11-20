//express
var express = require('express');
var bodyParser = require('body-parser');
app = express();
port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CAREGAR ----------
app.post("/carregar/:ano/:mes", function (req, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    var request = req.body;
    var ano = req.params.ano;
    var mes = req.params.mes;
    console.log("body request: ");
    console.log(request);
    response.send("Ano: " + ano + " Mês: " + mes);
});
//SALVAR ----------
app.post("/salvar/:ano/:mes", function (req, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    var request = req.body;
    var ano = req.params.ano;
    var mes = req.params.mes;
    console.log("body request do salvar: ");
    console.log(request);
    response.send("Ano: " + ano + " Mês: " + mes);
});
app.listen(port);