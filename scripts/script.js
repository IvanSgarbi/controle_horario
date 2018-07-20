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
        var tr = this.parentElement.parentElement;
        atualizar(this.parentElement.children);

        selecionar(tr);
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
    $("mes table tr").click(function () {
        selecionar(this);
    });
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
function selecionar(tr) {
    var dia_atual = tr.getAttribute("dia");
    var inicio_semana;
    var dias_selecionados = [];
    var cont = 0;
    dia_semana = tr.getAttribute("dia-semana");
    inicio_semana = dia_atual - dia_semana;

    $("tr").each(function(index,elemento) {
        var dia = elemento.getAttribute("dia");
        if(dia >= inicio_semana && dia <=inicio_semana+6 && dia > 0){
            dias_selecionados[cont] = elemento;
            cont++;
            //dias_selecionados.push(elemento);
        }
    });
    cont=0;
    $("tr").each(function(index,elemento){
        elemento.setAttribute("style","background: black");
    });
    for (cont = 0; cont < dias_selecionados.length; cont++) {
        dias_selecionados[cont].setAttribute("style","background: blue");
    }
    tr.setAttribute("style","background: #FFFF00");
    
    relatorio(tr,dias_selecionados);
}
function relatorio(dia,semana) {
    var horario = dia.children[1].children;
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var turno_tarde;
    var sair;
    var limite_manha;
    var limite_tarde;
    var resultado_dia = document.getElementsByClassName("relatorio-dia-container")[0];
    var resultado_semana = document.getElementsByClassName("relatorio-semana-container")[0];
    if(chegada == "" || almoco_ida == "" || almoco_volta == ""){
        resultado_dia.innerHTML = "";
        return;
    }
    var turno_manha = diferenca(chegada,almoco_ida);
    if(saida != ""){
        turno_tarde = diferenca(almoco_volta,saida);


        resultado_dia.innerHTML = "Seu turno da tarde foi de "+ turno_tarde;
    }else{
        sair = soma(almoco_volta,diferenca(turno_manha,"08:48"));
        quanto_falta(sair);
        resultado_dia.innerHTML = "Você pode sair as " + sair;
    }
    
    
    
}
function quanto_falta(sair){
    var agora = new Date();
    var porcentagem;
    agora = agora.getHours() * agora.getMinutes();
    sair = sair.split(":");
    sair = parseInt(sair[0]) * parseInt(sair[1]);
    porcentagem = (agora*100)/sair;
    if(porcentagem > 100){
        porcentagem = 100;
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
            "<tr dia="+cont+" dia-semana="+dia_semana+">"+
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