//express
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var arquivoVazio = '{"dias":[["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""],["","","",""]]}';
app = express();
port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CAREGAR ----------
app.get("/carregar/:ano/:mes", function (req, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    var ano = req.params.ano;
    var mes = req.params.mes;
    enviarArquivo();
    function enviarArquivo() {
        fs.readFile("dados/" + mes + "-" + ano + ".json", function (erro, dados) {
            if (erro) {
                log("erro ao ler arquivo");
                response.send("vazio");
            } else {
                response.send(dados);
            }
        });
    }
});
//SALVAR ----------
app.post("/salvar/:ano/:mes", function (req, response) {
    var resposta;
    response.setHeader('Access-Control-Allow-Origin', '*');
    var dados = req.body;
    var ano = req.params.ano;
    var mes = req.params.mes;
    fs.writeFile("dados/" + mes + "-" + ano + ".json", JSON.stringify(dados), function (erro) {
        if (erro) {
            resposta = "ERRO AO GRAVAR NO DISCO";
        } else {
            resposta = "Gravado com sucesso!";
        }
        response.send(resposta);
    });
});

app.listen(port);

function log(mensagem) {
    console.log(mensagem);
}