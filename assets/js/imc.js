// Objeto que controla todas as ações de tela

var step = 1,
    pessoa = {peso: 0, altura: 0, idade: 0},
    allowed_keys = [38, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 13, 44, 46],
    criancas_jovens = [
      {min: null, max: 18.5, classificacao: "Baixo peso", peso_ideal: false},
      {min: 18.5, max: 24.9, classificacao: "Eutrofia (peso ideal)", peso_ideal: true},
      {min: 25,   max: 29.9, classificacao: "Excesso de peso", peso_ideal: false},
      {min: 30,   max: 204, classificacao: "Obesidade", peso_ideal: false}], //https://goo.gl/rb2ftG

    adultos = [
      {min: null, max: 18.4, classificacao: "Baixo peso", peso_ideal: false},
      {min: 18.5, max: 24.9, classificacao: "Eutrofia (peso ideal)", peso_ideal: true},
      {min: 25,   max: 29.9, classificacao: "Pré-obesidade", peso_ideal: false},
      {min: 30,   max: 34.9, classificacao: "Obesidade, grau I", peso_ideal: false},
      {min: 35,   max: 39.9, classificacao: "Obesidade, grau II", peso_ideal: false},
      {min: 40,   max: 204, classificacao: "Obesidade mórbida", peso_ideal: false}],

    idosos = [
      {min: null, max: 22,   classificacao: "Desnutrição", peso_ideal: false},
      {min: 22,   max: 23.9, classificacao: "Risco de desnutrição", peso_ideal: true},
      {min: 24,   max: 26.9, classificacao: "Eutrofia (peso ideal)", peso_ideal: false},
      {min: 27,   max: 32,   classificacao: "Pré-obesidade", peso_ideal: false},
      {min: 32,   max: 204, classificacao: "Obesidade", peso_ideal: false}];

var IMCControl = {

  initialize: function() {
    $("#peso").mask("000,00", {reverse: true});
    $("#altura").mask("9,99");
    $("#idade").mask("99");

    $(".imc-form input").on("keypress", function(e) {
      if(allowed_keys.indexOf(event.charCode) < 0) return false;

      if($(this).attr("id") == "peso")
        if($(this).val().length == 6 && event.charCode != 13) return false

    });

    $(".center-results button:not(.refazer)").click(function(){
      $("#tables").fadeIn();
      $('html,body').animate({scrollTop: $("#tables").offset().top}, "fast");
    });

    $("button.refazer").click(function() { IMCControl.resetForm(); });

    $(".imc-form").on("submit", IMCControl.envia);

    IMCControl.focusFirstVisibleInput();
  },

  envia: function() {
    // validação de campos vazios
    $step = $("#step" + step);
    if($step.find("input").val() == "") {
      $step.find(".error").html("Por favor, preencha o campo:");
      return false;
    }
    IMCControl.saveData(); step += 1;

    if(step <= 3) {
      $(".step").hide();
      $("#step" + step).css("display", "block");
      $(".pb-slide").attr("css", "pb-slide").addClass("step" + step);
      IMCControl.focusFirstVisibleInput();
    } else {
      IMCControl.showResults();
    }

    return false;
  },

  focusFirstVisibleInput: function() {
    $(".error").html("");
    $("input:visible:first").focus();
  },

  saveData: function() {
    if(step == 1) pessoa.peso   = $("#peso").val();
    if(step == 2) pessoa.altura = $("#altura").val();
    if(step == 3) pessoa.idade  = $("#idade").val();
  },

  showResults: function() {
    $("body").addClass("done");
    $(".step i").html("");
    $(".pb-slide").attr("css", "pb-slide").addClass("step4");

    $(".imc-title img").addClass("move");

    setTimeout(function(){
      $(".pb-slide").addClass('ok');
      setTimeout(function(){ $(".pb-slide").fadeOut("fast", function(){
        $("#full-resultado, .center-results button").fadeIn();
      }); }, 500);
    }, 500);

    var idade = parseInt(pessoa.idade, 10),
        imc = 0.00,
        tabela = null;
        array = [];

    if(idade < 21) {
      tabela = 0;
      array = criancas_jovens;
    } else if(idade < 65) {
      tabela = 1;
      array = adultos;
    } else {
      tabela = 2;
      array = idosos;
    }

    var peso = parseFloat(pessoa.peso.replace(",","."));
    var altura = parseFloat(pessoa.altura.replace(",","."));

    imc = peso / (altura * altura);

    $(array).each(function(index, el) {
      if(imc > el.min && imc < el.max) {
        if(el.peso_ideal) {
          $("#full-resultado").html("Parabéns, você está no PESO IDEAL :)");
        } else {
          $("#full-resultado").html(el.classificacao + ". Ops, está na hora de rever os seus hábitos :/");
        }
        $("#tables table:eq("+tabela+") tbody tr:eq("+index+")").addClass("resultado");
      }
    });

    var rounded = Number((imc).toFixed(2)).toString().replace(".", ",");
    $(".imc-title h1").html("Seu IMC é <br /> <b>" + rounded + "</b>");
  },

  resetForm: function() {
  // com mais tempo faria de outra forma
  //   pessoa.peso = 0;
  //   pessoa.altura = 0;
  //   pessoa.idade = 0;
  //   step = 1;

  //   $(".step").hide();
  //   $("#step" + step).css("display", "block");
  //   $(".step i").html("Qual sua idade?");
  //   $(".pb-slide")[0].className = "pb-slide step" + step;

  window.location.href = "/";
  }

}
