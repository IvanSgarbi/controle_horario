$(document).ready(function () {
    var dia_atual;
    dia_atual = new Date();
    $("#mes_selecionado").val(dia_atual.getMonth());
    $("#ano_selecionado").val(dia_atual.getFullYear());
    gerar_form(dia_atual.getMonth());
    console.log("teste");
});
function atualizar(horario) {
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var resultado_dia = horario[0].parentElement.parentElement.children[2];
    if (chegada != "" && almoco_ida != "" && almoco_volta != "" && saida != "") {
        var resultado = "Manhã: " + diferenca(chegada, almoco_ida) + " horas. " +
            "Tarde: " + diferenca(almoco_volta, saida) + " horas. " +
            "Total:" + soma(diferenca(chegada, almoco_ida), diferenca(almoco_volta, saida)) + " horas"
        $(resultado_dia).text(resultado);
    }
}
function selecionar(tr) {
    var dia_atual = tr.getAttribute("dia");
    var inicio_semana;
    var dias_selecionados = [];
    var cont = 0;
    var dia_semana = tr.getAttribute("dia-semana");
    inicio_semana = dia_atual - dia_semana;

    $("tr").each(function (index, elemento) {
        var dia = elemento.getAttribute("dia");
        if (dia >= inicio_semana && dia <= inicio_semana + 6 && dia > 0) {
            dias_selecionados[cont] = elemento;
            cont++;
        }
    });
    cont = 0;
    $("tr").each(function (index, elemento) {
        elemento.classList.add("nao-selecionado");
        elemento.classList.remove("semana-selecionada");
        elemento.classList.remove("dia-selecionado");
    });
    for (cont = 0; cont < dias_selecionados.length; cont++) {
        dias_selecionados[cont].classList.remove("nao-selecionado");
        dias_selecionados[cont].classList.add("semana-selecionada");
    }
    tr.classList.remove("semana-selecionada");
    tr.classList.add("dia-selecionado");
    relatorio(tr, dias_selecionados);
}
function relatorio(dia, semana) {
    var agora = new Date();
    agora = agora.getHours() + ":" + agora.getMinutes();
    var horario = dia.children[1].children;
    var mes = document.querySelectorAll("mes tr");
    var extra_mes = "00:00";
    var horas_mes = "00:00";
    var devendo_mes = "00:00";
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var sair, cont, sair_hoje, dia_semana, horas_dia, turno_manha;
    var horas_semana = "00:00";
    var extra_semana = "00:00";
    var resultado_dia = document.getElementsByClassName("relatorio-dia-container")[0].children[1];
    var resultado_semana = document.getElementsByClassName("relatorio-semana-container")[0].children[1];
    var resultado_mes = document.getElementsByClassName("relatorio-mes-container")[0].children[1];
    //RELATÓRIO DIA
    if (almoco_volta != "" && chegada != "" && saida != "" && almoco_ida != "") {
        horas_dia = total_dia(dia);
        resultado_dia.innerHTML = "Você trabalhou " + horas_dia.total +
            " nesse dia! <br> Com " + horas_dia.extra + " de horas extras";
    } else if (chegada != "" && almoco_ida != "" && almoco_volta != "") {
        var pode_sair = "";
        turno_manha = diferenca(chegada, almoco_ida);
        horas_dia = total_dia(dia);
        sair = soma(almoco_volta, diferenca(turno_manha, "08:48"));
        sair_hoje = quanto_falta(sair, almoco_volta);
        if (sair_hoje.horas == "00:00") {
            pode_sair = "VOCÊ JÁ PODE SAIR! E FEZ " + diferenca(sair, agora) + " HORAS EXTRAS HOJE!";
            var hora_extra_dia = diferenca(sair, agora).split(":");
            hora_extra_dia = hora_extra_dia[0] * 60 + hora_extra_dia[1];
            porcentagem_extra_dia = Math.floor(hora_extra_dia*100 / 72);

            //BOTAR AQUI A BARRA DE HORAS EXTRAS
            console.log(hora_extra_dia);
            resultado_dia.innerHTML = pode_sair + "<br><progress class='progress-hora-extra' value=" + porcentagem_extra_dia +
            " max=100></progress><br>" +
            "Você ainda pode fazer " + diferenca(diferenca(sair, agora), "01:12") + " extras hoje!";
        }
        else {
            resultado_dia.innerHTML = "Você pode sair as " + sair + "<br>E faltam " + sair_hoje.horas +
                " para vc poder sair<br>" +
                "<progress value=" + sair_hoje.porcentagem + " max=100></progress><br>Você já fez " + sair_hoje.porcentagem +
                "% do seu turno da tarde<br>";
        }

    } else if (almoco_ida != "" && chegada != "") {
        var volta_almoco = soma(almoco_ida, "01:00");
        horas_dia = total_dia(dia);
        turno_manha = diferenca(chegada, almoco_ida);
        resultado_dia.innerHTML = "Você trabalhou " + turno_manha + " horas no turno da manhã<br>" +
            "E pode voltar " + volta_almoco + "<br>";
        
    } else if (chegada != "") {
        var previsao = soma(chegada, "09:48");
        agora = new Date();
        agora = agora.getHours() + ":" + agora.getMinutes();
        var max_almoco = soma(chegada, "06:00");
        var falta_max_almoco = diferenca(agora, max_almoco);
        resultado_dia.innerHTML = "Seu horário máximo de sair para o intervalo será às " +
            max_almoco + "<br>Você pode trabalhar no máximo mais " + falta_max_almoco +
            " nesse turno <br> Se fizer um Intervalo de exatamente uma hora poderá sair as " +
            previsao;
        //BOTAR AQUI BARRA DO ALMOÇO
    } else {
        resultado_dia.innerHTML = "";

    }
    //RELATÓRIO SEMANAL
    for (cont in semana) {
        dia_semana = semana[cont];
        if (dia_trabalhado(dia_semana)) {
            log("Dia " + dia_semana.getAttribute("dia") + " Foi um dia trabalhado!");
            horas_dia = total_dia(dia_semana);
            horas_semana = soma(horas_semana, horas_dia.total);
            extra_semana = soma(extra_semana, horas_dia.extra);
        } else {
            log("Dia " + dia_semana.getAttribute("dia") + " não foi um dia trabalhado!");
        }
    }
    //RELATóRIO DE HORAS EXTRAS MENSAL
    for (cont = 0; cont < mes.length; cont++) {
        if (dia_trabalhado(mes[cont])) {
            horas_dia = total_dia(mes[cont]);
            horas_mes = soma(horas_mes, horas_dia.total);
            extra_mes = soma(extra_mes, horas_dia.extra);
            if (mes[cont].getAttribute("dia-semana") != "0" &&
                mes[cont].getAttribute("dia-semana") != "6" &&
                horas_dia.devendo != "00:00") {
                devendo_mes = soma(devendo_mes, horas_dia.devendo);
            }
        }
    }

    resultado_semana.innerHTML =
        "Horas na semana " + horas_semana +
        "<br> Extras na semana: " + extra_semana;
    resultado_mes.innerHTML =
        "<br> Horas no Mês: " + horas_mes +
        "<br> Extras no Mês: " + extra_mes +
        "<br> Devendo mês: " + devendo_mes +
        "<br> Saldo de horas do mês: " + diferenca(devendo_mes, extra_mes);

}
function dia_trabalhado(dia) {
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;

    return ((chegada != "" && almoco_ida != "" && almoco_volta != "" && saida != "") ||
        (chegada != "" && almoco_ida != ""));

}
function total_dia(dia) {
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var extra;
    var devendo = "00:00";
    var dia_semana = dia.getAttribute("dia-semana");
    var horas_dia;
    if (almoco_volta == "" || saida == "") {
        horas_dia = diferenca(chegada, almoco_ida);
        devendo = soma(devendo, diferenca(horas_dia, "08:48"));
        extra = "00:00";
    } else {
        horas_dia = soma(diferenca(chegada, almoco_ida), diferenca(almoco_volta, saida));
        if (maior(horas_dia, "08:48")) {
            extra = diferenca("08:48", horas_dia);
        } else {
            devendo = soma(devendo, diferenca(horas_dia, "08:48"));
            extra = "00:00";
        }
    }
    if (dia_semana == 0 || dia_semana == 6) {
        extra = horas_dia;
    }
    return {
        total: horas_dia,
        extra: extra,
        devendo: devendo
    }
}

function quanto_falta(sair, almoco_volta) {
    var agora = new Date();
    var porcentagem;
    var resultado = {
        porcentagem: null,
        hora: null
    };
    var saida_minutos = "";
    var saida_horas = "";
    almoco_volta = almoco_volta.split(":");
    almoco_volta = parseInt(almoco_volta[0]) * 60 + parseInt(almoco_volta[1]);
    agora = agora.getHours() * 60 + agora.getMinutes();
    sair = sair.split(":");
    sair = parseInt(sair[0]) * 60 + parseInt(sair[1]);
    porcentagem = (agora - almoco_volta) * 100 / (sair - almoco_volta);
    if (porcentagem > 100) {
        porcentagem = 100;
    }
    saida_minutos = (sair - agora) % 60;
    if (saida_minutos < 10) {
        if (saida_minutos < 0) {
            saida_minutos = "00"
        } else {
            saida_minutos = "0" + saida_minutos;
        }
    }
    saida_minutos = saida_minutos.toString();
    saida_minutos = saida_minutos.charAt(0) + saida_minutos.charAt(1);
    saida_horas = Math.floor((sair - agora) / 60);
    if (saida_horas < 10) {
        if (saida_horas < 0) {
            saida_horas = "00";
        } else {
            saida_horas = "0" + saida_horas;
        }
    }
    resultado.porcentagem = Math.floor(porcentagem);
    resultado.horas = saida_horas + ":" + saida_minutos;
    return resultado;
}
function maior(valor1, valor2) {
    valor1 = valor1.split(":");
    valor2 = valor2.split(":");
    valor1 = Number(valor1[0]) * 60 + Number(valor1[1]);
    valor2 = Number(valor2[0]) * 60 + Number(valor2[1]);
    return (valor1 > valor2);
}
function dividir(hora, divisor) {
    hora = hora.split(":");
    divisor = Number(divisor);
    hora = Number(hora[0]) * 60 + Number(hora[1]);
    var resultado_minutos = Math.floor(hora / divisor);
    return Math.floor(resultado_minutos / 60) + ":" + resultado_minutos % 60;
}
function porcentagem(x, total) {
    var porcentagem;
    x = x.split(":");
    x = parseInt(x[0]) * 60 + parseInt(x[1]);
    total = total.split(":");
    total = parseInt(total[0]) * 60 + parseInt(total[1]);
    porcentagem = Math.floor(x * 100 / total);
    return porcentagem;
}
//devolve um intervalo de tempo
function diferenca(hora1, hora2) {
    var resultado;
    var minutos = 0;
    var horas = 0;
    var negativo = false;
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");

    hora1 = hora1[0] * 60 + hora1[1] * 1;
    hora2 = hora2[0] * 60 + hora2[1] * 1;

    if(hora2 >= hora1){
        horas = Math.floor((hora2 - hora1) / 60);
        minutos = (hora2 - hora1) % 60;
    }else{
        negativo = true;
        horas = Math.ceil((hora2 - hora1) / 60) * -1;
        minutos = ((hora2 - hora1) % 60) * -1;
    }

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    if (horas < 10) {
        horas = "0" + horas;
    }

    if(!negativo){
        resultado = horas + ":" + minutos;
    }else{
        resultado = "-" + horas + ":" + minutos;
    }
    
    return resultado;
}
function soma(hora1, hora2) {
    var resultado;
    var horas = 0;
    var minutos = 0;
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");
    horas = hora1[0] * 1 + hora2[0] * 1;
    minutos = hora1[1] * 1 + hora2[1] * 1;
    if (minutos > 59) {
        minutos -= 60;
        horas++;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    if (horas < 10) {
        horas = "0" + horas;
    }
    resultado = horas + ":" + minutos;
    return resultado;
}
function dias_no_mes(mes_num) {
    mes_num = parseInt(mes_num);
    var meses = [
        { mes: "Janeiro", dias: 31 },
        { mes: "Fevereiro", dias: 28 },
        { mes: "Março", dias: 31 },
        { mes: "Abril", dias: 30 },
        { mes: "Maio", dias: 31 },
        { mes: "Junho", dias: 30 },
        { mes: "Julho", dias: 31 },
        { mes: "Agosto", dias: 31 },
        { mes: "Setembro", dias: 30 },
        { mes: "Outubro", dias: 31 },
        { mes: "Novembro", dias: 30 },
        { mes: "desembro", dias: 31 }
    ];
    var mes_dias = meses[mes_num];
    if ($("#ano_selecionado").val() % 4 == 0 && mes_num == 1) {
        mes_dias.dias = 29;
    }
    return mes_dias;
}
function gerar_form(mes) {
    $("mes").html("Carregando...");
    var ano = $("#ano_selecionado").val();
    log("Gerando tabela para:")
    log("Ano: " + ano + " e mes: " + mes);
    var dias_semana_extenso =
        ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira",
            "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var dia_semana = new Date(ano, mes, 1);
    dia_semana = dia_semana.getDay();
    var dias = dias_no_mes(mes);
    dias = dias.dias;
    var cont;
    var html = "<table>";
    for (cont = 1; cont <= dias; cont++) {
        html +=
            "<tr class='nao-selecionado' dia=" + cont + " dia-semana=" + dia_semana + ">" +
            "<td>" +
            dias_semana_extenso[dia_semana] + " " + cont +
            ":</td>" +
            "<td>" +
            "<input class='time-input' type='text' placeholder=' - - : - - ' maxlength='5' width='20'>" +
            "<input class='time-input' type='text' placeholder=' - - : - - ' maxlength='5' width='20'>" +
            "<input class='time-input' type='text' placeholder=' - - : - - ' maxlength='5' width='20'>" +
            "<input class='time-input' type='text' placeholder=' - - : - - ' maxlength='5' width='20'>" +
            "</td>" +
            "<td>" +
            "</td>" +
            "</tr>";
        dia_semana++;
        if (dia_semana > 6) {
            dia_semana = 0;
        }
    }
    html += "</table>";
    $("mes").html(html);
}

function salvar() {
    iconeSalvando();
    var dadosExportar = { dias: [] };
    var valores = document.querySelectorAll(".time-input");
    var cont;
    var dia_cont;
    for (cont = 0; cont < valores.length; cont++) {
        dia_cont = Math.floor(cont / 4);
        if (!dadosExportar.dias[dia_cont]) {
            dadosExportar.dias[dia_cont] = [];
        }
        dadosExportar.dias[dia_cont].push(valores[cont].value);
    }
    log(dadosExportar);
    salvarEmDisco(dadosExportar);
}
function salvarEmDisco(dados) {
    var mes = $("#mes_selecionado").val();
    var ano = $("#ano_selecionado").val();
    $.ajax({
        type: "POST",
        url: "/salvar/" + ano + "/" + mes,
        data: dados,
        success: function (resposta) {
            log("Sucesso ao salvar");
            log(resposta);
            limparLoading();
        },
        error: function (resposta) {
            log("Erro ao salvar");
            log(resposta);
            limparLoading();
        }
    });
}
function carregar() {
    iconeCarregando();
    var mes = $("#mes_selecionado").val();
    var ano = $("#ano_selecionado").val();
    $.ajax({
        type: "GET",
        url: "/carregar/" + ano + "/" + mes,
        success: function (resposta) {
            log("Sucesso ao Carregar");
            log(resposta);
            if (resposta != "vazio") {
                preencherCampos(resposta);
            }
        },
        error: function (resposta) {
            log("Erro ao carregar");
            log(resposta);
            limparLoading();
        }
    });
}
function preencherCampos(string) {
    var objetoDados = JSON.parse(string);
    var arrayCampos = document.querySelectorAll(".time-input");
    var cont, cont2, cont3 = 0;
    for (cont = 0; cont < objetoDados.dias.length; cont++) {
        for (cont2 = 0; cont2 < 4; cont2++) {
            arrayCampos[cont3].value = objetoDados.dias[cont][cont2];
            cont3++;
        }
    }
    limparLoading();
}
function iconeCarregando() {
    document.getElementById("status").style.visibility = "visible";
    document.getElementById("status").children[1].innerHTML = "Carregando...";
}
function iconeSalvando() {
    document.getElementById("status").style.visibility = "visible";
    document.getElementById("status").children[1].innerHTML = "Salvando...";
}
function limparLoading() {
    var timer = setTimeout(function () {
        document.getElementById("status").style.visibility = "hidden";
        document.getElementById("status").children[1].innerHTML = "";
    }, 1000);
    log(timer.valueOf());
}
function log(string) {
    console.log(string);
}
function arruma_horas(input) {
    var horas = input.value.substr(0, 2);
    var resto = input.value.substr(2, input.value.length);
    if (!isNaN(horas) && horas > 23) {
        horas = 23;
    }
    input.value = horas + resto;
}
function arruma_minutos(input) {
    if (input.value.length < 5) {
        return;
    }
    var minutos = input.value.substr(3, 5);
    var resto = input.value.substr(0, 3);
    if (!isNaN(minutos) && minutos > 59) {
        minutos = 59;
    }
    input.value = resto + minutos;
}
function arruma_pontos(input) {
    var parte1 = input.value.substr(0, 2);
    var parte2 = input.value.substr(2, input.value.length);
    if (input.value.length > 2 && input.value.indexOf(":") < 0) {
        input.value = parte1 + ":" + parte2;
    }
}
$(document).on("keyup", ".time-input", function (event) {
    //verificar se as horas são maiores que 23
    arruma_horas(this);
    //verificar os minutos
    arruma_minutos(this);
    //coloca os dois pontos
    arruma_pontos(this);
});
$(document).on("change", ".time-input", function (event) {
    //Verificar integridade das horas
    var tr = this.parentElement.parentElement;
    var input = this;
    selecionar(tr);
    if (input.value.length < 5) {
        input.value = "";
        return;
    } else {
        var horario = input.value.split(":");
        if (horario[0].length != horario[1].length) {
            input.value = "";
            return;
        }
    }
});
$(document).on("change", "#mes_selecionado", function () {
    gerar_form(this.value);
});
$(document).on("keyup", "#ano_selecionado", function () {
    var ano = $("#ano_selecionado").val();
    var mes = $("#mes_selecionado").val();
    if (ano.length > 3) {
        gerar_form(mes);
    }
});
$(document).on("click", "mes table tr", function () {
    selecionar(this);
});
$(document).on("click", "#salvar", function () {
    salvar();
});
$(document).on("click", "#carregar", function () {
    carregar();
});