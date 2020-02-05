function obter_feriados_ano_externo(ano, mes) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.calendario.com.br/?json=true&ano=" + ano + "&ibge=4314100&token=aXZhbi5kazY2NkBob3RtYWlsLmNvbSZoYXNoPTQwNTMwMjAy");
    request.onreadystatechange = function (response) {
        if (request.status == 200 && request.readyState == 4) {
            if (JSON.parse(request.response)) {
                var feriados = JSON.parse(request.response);
                console.log(JSON.parse(request.response));
                for (var i = 0; i < feriados.length; i++) {
                    if (feriados[i].type_code != "1" && feriados[i].type_code != "2") {
                        feriados.splice(i, 1);
                        i = 0;
                    }
                }
                console.log("Depois da conversão", feriados);
                salvar_feriados_ano(feriados, ano, mes);
            } else {
                console.log("Erro de formato do recebimento de feriados");
                //tratamento de erro aqui
            }
        }
    }
    request.send();
}

function obter_feriados_mes(mes, ano) {
    $.ajax({
        type: "GET",
        url: "/feriados/" + ano,
        success: function (res) {
            log("Sucesso ao Carregar");
            log(res);

            if (res) {
                feriados_ano = JSON.parse(res);

                if (feriados_ano[Number(mes)]) {
                    preencher_feriados(feriados_ano[Number(mes)]);
                }
            }
        },
        error: function (erro) {
            if (erro.status == 404) {
                obter_feriados_ano_externo(ano, mes);
            }
        }
    });
}

function salvar_feriados_ano(feriados, ano, mes) {
    feriados = formatar_feriados(feriados);

    $.ajax({
        type: "POST",
        url: "/feriados/" + ano,
        data: feriados,
        success: function (res) {
            log("Sucesso ao salvar feriados");
            obter_feriados_mes(mes, ano);
        },
        error: function (res) {
            log("Erro ao salvar feriados");
            log(res);
        }
    });
}

function formatar_feriados(feriados) {
    var feriados_formatados = {};
    var mes, dia;
    for (var i = 0; i < feriados.length; i++) {
        data = feriados[i].date;
        mes = Number(data.substring(3, 5));
        dia = data.substring(0, 2);

        if (!feriados_formatados[mes]) {
            feriados_formatados[mes] = [];
        }

        feriados_formatados[mes].push(
            {
                dia: dia,
                nome: feriados[i].name
            }
        );
    }

    return feriados_formatados;
}

function preencher_feriados(feriados) {
    var dia;
    for (var i = 0; i < feriados.length; i++) {
        dia = document.querySelector("tr[dia='" + Number(feriados[i].dia) + "']");
        dia.classList.add("feriado");
    }
}