$(document).ready(function () {
    var dia_atual;
    dia_atual = new Date();
    gerar_form(dia_atual.getMonth());
    $("#mes_selecionado").val(dia_atual.getMonth());
    $("#ano_selecionado").val(dia_atual.getFullYear());
    triggers();
});
function triggers() {
    $("input[type='time']").change(function () {

        atualizar(this.parentElement.children);
    });
    $("#mes_selecionado").change(function () {
        gerar_form(this.value);
    });
    document.getElementById("ano_selecionado").onkeyup = function () {
        var ano = $("#ano_selecionado").val();
        var mes = $("#mes_selecionado").val();
        if (ano.length > 3) {
            gerar_form(mes);
        }
    }
}
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
            "<tr>" +
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
//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);