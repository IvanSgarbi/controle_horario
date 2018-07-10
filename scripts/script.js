$(document).ready(function () {
    ko.applyBindings(new budega());

    $("#tamanho").change(function(){
        $("progress").css("width",(this.value*3+100)+"px");
        $("#tamanhoSpan").text((this.value*3+100)+"px");
    });
    $("progress").css("width","100px");
    $("#tamanhoSpan").text(($("#tamanho").value*3+100)+"px");
    $("#valor_barra").change(function () {
        $("#barra_de_progresso > div").css("width",this.value+"%");   
    });
    
});

function budega() {
    var pessoa = function (nome,classe) {
        this.nome = nome;
        this.classe = classe;     
    }
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertingtons");
    this.progresso = ko.observable();
    this.tamanho = ko.observable();
    this.selecionado = ko.observable(new pessoa("",""));
    this.fonte = ko.computed(function(){
        return {"font-size": (this.tamanho()+"px;")};
    },this);
    this.progresso1 = ko.computed(function(){
        return this.progresso()-10;
    },this);
    this.progresso2 = ko.computed(function(){
        return this.progresso()-20;
    },this);
    this.estilo = ko.observable("font-size: 12px");
    var lista = [1,2,3,4,5];
    this.itens = ko.observableArray(lista);
    this.vetor = ko.observableArray([
        new pessoa("Jonilson","Bardo"),
        new pessoa("Eriks","Guerreiro"),
        new pessoa("Lulucas","Mago"),
        new pessoa("Tatiana","Clériga")
    ]);
    this.funcaolegal = function(){
        alert(this.selecionado().nome + this.selecionado().classe);


    }

}


    