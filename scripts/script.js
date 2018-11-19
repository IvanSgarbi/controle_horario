$(document).ready(function () {
    var dia_atual;
    dia_atual = new Date();
    gerar_form(dia_atual.getMonth());
    $("#mes_selecionado").val(dia_atual.getMonth());
    $("#ano_selecionado").val(dia_atual.getFullYear());
    triggers();
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
    dia_semana = tr.getAttribute("dia-semana");
    inicio_semana = dia_atual - dia_semana;

    $("tr").each(function (index, elemento) {
        var dia = elemento.getAttribute("dia");
        if (dia >= inicio_semana && dia <= inicio_semana + 6 && dia > 0) {
            dias_selecionados[cont] = elemento;
            cont++;
            //dias_selecionados.push(elemento);
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
    log(semana);
    var agora = new Date();
    agora = agora.getHours() + ":" + agora.getMinutes();
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var sair;
    var cont;
    var sair_hoje;
    var dia_semana;
    var horas_semana = "00:00";
    var extra_semana = "00:00";
    var horas_dia;
    var resultado_dia = document.getElementsByClassName("relatorio-dia-container")[0];
    var resultado_semana = document.getElementsByClassName("relatorio-semana-container")[0];
    var turno_manha;
    //RELATÓRIO DIA
    if (almoco_volta != "" && chegada != "" && saida != "" && almoco_ida != "") {
        horas_dia = total_dia(dia);
        resultado_dia.innerHTML = "Você trabalhou " + horas_dia.total +
            " nesse dia! <br> Com " + horas_dia.extra + " de horas extras";
    } else if (chegada != "" && almoco_ida != "" && almoco_volta != "") {
        var pode_sair = "";
        turno_manha = diferenca(chegada, almoco_ida);
        sair = soma(almoco_volta, diferenca(turno_manha, "08:48"));
        sair_hoje = quanto_falta(sair, almoco_volta);
        if (sair_hoje[1] == "00:00") {
            //continuar daqui
            pode_sair = "VOCÊ JÁ PODE SAIR! E FEZ " + diferenca(sair, agora) + " HORAS EXTRAS HOJE!";
        }
        resultado_dia.innerHTML = "Você pode sair as " + sair + "<br>E faltam " + sair_hoje[1] +
            " para vc poder sair<br>" +
            "<progress value=" + sair_hoje[0] + " max=100></progress><br>Você já fez " + sair_hoje[0] +
            "% do seu turno da tarde<br>" + pode_sair;
    } else if (almoco_ida != "" && chegada != "") {
        var volta_almoco = soma(almoco_ida, "01:00");
        turno_manha = diferenca(chegada, almoco_ida);
        resultado_dia.innerHTML = "Você trabalhou " + turno_manha + " horas no turno da manhã<br>" +
            "E pode voltar " + volta_almoco + "<br>"
    } else if (chegada != "") {
        var agora = new Date();
        agora = agora.getHours() + ":" + agora.getMinutes();
        var max_almoco = soma(chegada, "06:00");
        var falta_max_almoco = diferenca(agora, max_almoco);
        resultado_dia.innerHTML = "Seu horário máximo de sair para o intervalo será às " +
            max_almoco + "<br>E você pode trabalhar no máximo mais " + falta_max_almoco + " nesse turno";
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
    resultado_semana.innerHTML =
        "Horas na semana " + horas_semana +
        "<br> Extras na semana: " + extra_semana;
}
function dia_trabalhado(dia) {
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    if (chegada == "" || almoco_ida == "" || almoco_volta == "" || saida == "") {
        return false;
    } else {
        return true;
    }
}
function total_dia(dia) {
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var horas_dia = soma(diferenca(chegada, almoco_ida), diferenca(almoco_volta, saida));
    var extra = diferenca("08:48", horas_dia);
    return {
        total: horas_dia,
        extra: extra
    }
}
function quanto_falta(sair, almoco_volta) {
    var agora = new Date();
    var porcentagem;
    var resultado = [];
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
    resultado[0] = Math.floor(porcentagem);
    resultado[1] = saida_horas + ":" + saida_minutos;
    return resultado;
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
//devolve um intervalo de tempo, sendo hora1 menor que hora2
function diferenca(hora1, hora2) {
    var resultado;
    var minutos = 0;
    var horas = 0;
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");
    horas = hora2[0] * 1 - hora1[0] * 1;
    minutos = hora2[1] * 1 - hora1[1] * 1;
    if (minutos < 0) {
        minutos = 60 - (minutos * -1);
        horas--;
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
    var mes_dias;
    mes_num = parseInt(mes_num);
    switch (mes_num) {
        case 0:
            mes_dias = ["Janeiro", 31];
            break;
        case 1:
            if ($("#ano_selecionado").val() % 4 == 0) {
                mes_dias = ["Fevereiro", 29];
            } else {
                mes_dias = ["Fevereiro", 28];
            }
            break;
        case 2:
            mes_dias = ["Março", 31];
            break;
        case 3:
            mes_dias = ["Abril", 30];
            break;
        case 4:
            mes_dias = ["Maio", 31];
            break;
        case 5:
            mes_dias = ["Junho", 30];
            break;
        case 6:
            mes_dias = ["Julho", 31];
            break;
        case 7:
            mes_dias = ["Agosto", 31];
            break;
        case 8:
            mes_dias = ["Setembro", 30];
            break;
        case 9:
            mes_dias = ["Outubro", 31];
            break;
        case 10:
            mes_dias = ["Novembro", 30];
            break;
        case 11:
            mes_dias = ["desembro", 31];
            break;

        default:
            break;
    }
    return mes_dias;
}
function gerar_form(mes) {
    $("mes").html("Carregando...");
    var ano = $("#ano_selecionado").val();
    var dias_semana_extenso =
        ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira",
            "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var dia_semana = new Date(ano, mes, 1);
    dia_semana = dia_semana.getDay();
    var dias = dias_no_mes(mes);
    dias = dias[1];
    var cont;
    var html = "<table>";
    for (cont = 1; cont <= dias; cont++) {
        html +=
            "<tr class='nao-selecionado' dia=" + cont + " dia-semana=" + dia_semana + ">" +
            "<td>" +
            dias_semana_extenso[dia_semana] + " " + cont +
            ":</td>" +
            "<td>" +
            "<input type=time>" +
            "<input type=time>" +
            "<input type=time>" +
            "<input type=time>" +
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
    triggers();

}
function triggers() {

}
function log(string) {
    console.log(string);
}
$(document).on("change", "input[type='time']", function () {
    var tr = this.parentElement.parentElement;
    //atualizar(this.parentElement.children);

    selecionar(tr);
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
jQuery.support.cors = true;
$.ajax({
    type: "POST",
    url: "https://controlehorarios.herokuapp.com/teste",
    data: {sql:"SELECT * FROM data"},
    //dataType: "application/json",
    success: function (resposta) {
        var dados = resposta.rows[0];
        log("Sucesso");
        log(dados);
    }, error: function (resposta) {
        log("Erro");
        log(resposta);
    }
});