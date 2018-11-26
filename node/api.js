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
    var tempo = new Date();
    tempo = tempo.getDate()+"/"+(tempo.getMonth()+1)+"/"+tempo.getFullYear()+
    " "+tempo.getHours()+":"+tempo.getMinutes()+":"+tempo.getSeconds()+","+
    tempo.getMilliseconds();
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
                log(tempo+"|| arquivo " + mes + "-" + ano + ".json lido com sucesso!");
                response.send(dados);
            }
        });
    }
});
//SALVAR ----------
app.post("/salvar/:ano/:mes", function (req, response) {
    var tempo = new Date();
    tempo = tempo.getDate()+"/"+(tempo.getMonth()+1)+"/"+tempo.getFullYear()+
    " "+tempo.getHours()+":"+tempo.getMinutes()+":"+tempo.getSeconds()+","+
    tempo.getMilliseconds();
    var resposta;
    response.setHeader('Access-Control-Allow-Origin', '*');
    var dados = req.body;
    var ano = req.params.ano;
    var mes = req.params.mes;
    fs.writeFile("dados/" + mes + "-" + ano + ".json", JSON.stringify(dados), function (erro) {
        if (erro) {
            log("erro ao gravar arquivo");
            resposta = "ERRO AO GRAVAR NO DISCO";
        } else {
            log(tempo+"|| arquivo " + mes + "-" + ano + ".json gravado com sucesso!");
            resposta = "Gravado com sucesso!";
        }
        response.send(resposta);
    });
});

app.listen(port);

function log(mensagem) {
    console.log(mensagem);
}