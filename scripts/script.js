$(document).ready(function () {
    
    $("input").change(function(){
        atualizar(this.parentElement.children);
    });
});
function atualizar(horario) {
    var chegada = horario[0].value;
    var almoco_ida = horario[1].value;
    var almoco_volta = horario[2].value;
    var saida = horario[3].value;
    var resultado_dia = horario[4];
    var calculo;
    if(chegada != "" && almoco_ida != "" && almoco_volta != "" && saida != ""){
        
        
        //calculo = 
        resultado_dia.innerHTML = chegada+", "+almoco_ida+", "+almoco_volta+", "+saida;
        $("#resultado").html("No turno da manhã você Trabalhou "+ diferenca(chegada,almoco_ida)+" horas.<br>"+
        "E no turno da tarde você trabalhou "+ diferenca(almoco_volta,saida)+" horas.<br>"+
        "Um total de "+soma(diferenca(chegada,almoco_ida),diferenca(almoco_volta,saida))+" horas");
    }

}
function diferenca(hora1,hora2){
    var resultado;
    var minutos=0;
    var horas=0;
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");
    horas = hora2[0]*1 - hora1[0]*1;
    minutos = hora2[1]*1 - hora1[1]*1;
    if(minutos<0){
        minutos = 60 -(minutos*-1);
        horas --;
    }
    if(minutos<10){
        minutos = "0"+minutos;
    }
    if(horas<10){
        horas = "0"+horas;
    }
    resultado = horas+":"+minutos;
    return resultado;
}
function soma(hora1,hora2){
    var resultado;
    var horas=0;
    var minutos=0;
    hora1 = hora1.split(":");
    hora2 = hora2.split(":");
    horas = hora1[0]*1 + hora2[0]*1;
    minutos = hora1[1]*1 + hora2[1]*1;
    if(minutos>59){
        minutos -= 60;
        horas++;
    }
    if(minutos<10){
        minutos = "0"+minutos;
    }
    if(horas<10){
        horas = "0"+horas;
    }
    resultado = horas+":"+minutos;
    return resultado;
}

//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);