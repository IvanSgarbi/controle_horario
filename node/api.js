//express
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
app = express();
port = process.env.PORT || 5800;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//INICIAR SITE ----------------
app.get("/", function (req, response) {
    log("Foi o html");
    var caminho = __dirname.replace("\\node", "");
    response.sendFile(path.join(caminho + "/index.html"));
});
// ENVIAR ARQUIVOS JS,CSS e IMAGENS ----------------
app.get("*.*", function (req, response) {
    var tipo = req._parsedUrl.path.split(".")[1];

    fs.readFile(".." + req._parsedUrl.path, function (erro, dados) {
        if (erro) {
            response.send(erro);
        } else {
            if (tipo == "css") {
                response.writeHead(200, { 'Content-Type': 'text/css' });
            }
            response.write(dados);
            response.end();
        }
    });
});


//CAREGAR ----------
app.get("/carregar/:ano/:mes", function (req, response) {
    var tempo = obter_tempo();
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
                log(tempo + "|| arquivo " + mes + "-" + ano + ".json lido com sucesso!");
                response.send(dados);
            }
        });
    }
});
//SALVAR ----------
app.post("/salvar/:ano/:mes", function (req, response) {
    var tempo = obter_tempo();
    var resposta;
    response.setHeader('Access-Control-Allow-Origin', '*');
    var dados = req.body;
    log(typeof dados);
    log(dados);
    var ano = req.params.ano;
    var mes = req.params.mes;
    fs.writeFile("dados/" + mes + "-" + ano + ".json", JSON.stringify(dados), function (erro) {
        if (erro) {
            log("erro ao gravar arquivo");
            resposta = "ERRO AO GRAVAR NO DISCO";
        } else {
            log(tempo + "|| arquivo " + mes + "-" + ano + ".json gravado com sucesso!");
            resposta = "Gravado com sucesso!";
        }
        response.send(resposta);
    });
});

//OBTER FERIADOS ----------
app.get("/feriados/:ano", function (req, res) {
    var tempo = obter_tempo();
    var ano = req.params.ano;
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.readFile("dados/feriados-" + ano + ".json", function (erro, dados) {
        if (erro) {
            log("Arquivo inexistente");
            res.status(404);
            res.send("");
        } else {
            log(tempo + "|| arquivo feriados-" + ano + ".json lido com sucesso!");
            res.send(dados);
        }
    });
});

//SALVAR FERIADOS ----------
app.post("/feriados/:ano", function (req, res) {
    var tempo = obter_tempo();
    res.setHeader('Access-Control-Allow-Origin', '*');
    var dados = req.body;
    var ano = req.params.ano;
    fs.writeFile("dados/feriados-" + ano + ".json", JSON.stringify(dados), function (erro) {
        if (erro) {
            log("erro ao gravar arquivo");
            res.status(500);
            res.send("ERRO AO GRAVAR NO DISCO");
        } else {
            log(tempo + "|| arquivo feriados-" + ano + ".json gravado com sucesso!");
            res.status(200);
            res.send("Gravado com sucesso!");
        }
    });
});

function obter_tempo() {
    var tempo = new Date();
    tempo = tempo.getDate() + "/" + (tempo.getMonth() + 1) + "/" + tempo.getFullYear() +
        " " + tempo.getHours() + ":" + tempo.getMinutes() + ":" + tempo.getSeconds() + "," +
        tempo.getMilliseconds();

    return tempo;
}

function log(mensagem) {
    console.log(mensagem);
}
try {
    app.listen(port);
    log("Aplicação iniciada.");    
} catch (error) {
    log("Erro de inicialização de aplicação.");
}
