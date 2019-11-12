function estado(){
  var pais = document.getElementById("pais").value;
  var label = document.getElementById("label-estado");
  label.hidden = false;
  var estado;
  if (pais == 'México') {
    estado = document.getElementById("estado1");
    estado.hidden = false;
    estado.required = true;
    estado = document.getElementById("estado2");
    estado.hidden = true;
    estado.required = false;
    estado.value = "";
  }
  else {
    estado = document.getElementById("estado2");
    estado.hidden = false;
    estado.required = true;
    estado = document.getElementById("estado1");
    estado.hidden = true;
    estado.required = false;
    estado.value = "";
  }
}

function guardar_muestra(){
    var enviar = document.getElementById("enviar").value;
    document.getElementById("enviar").value=0;
}
function enviar_muestra(){
    var enviar = document.getElementById("enviar").value;
    document.getElementById("enviar").value=1;
}

function validar_campos(){
  var id;

  if($('#estado1').val() == null){
    var nombre = $('#nombre').val();
    var direccion = $('#direccion').val();
    var pais = $('#pais').val();
    var estado = $('#estado2').val();
    var idioma = $('#idioma').val();
    id = '#estado2';
  }
  else{
    var nombre = $('#nombre').val();
    var direccion = $('#direccion').val();
    var pais = $('#pais').val();
    var estado = $('#estado1').val();
    var idioma = $('#idioma').val();
    id = '#estado1';
  }

  var dict = {
    1 : check_is_not_empty(nombre, '#nombre'),
    2 : check_is_not_empty(direccion, '#direccion'),
    3 : check_is_not_empty(pais, '#pais'),
    4 : check_is_not_empty(estado,id),
    5 : check_is_not_empty(idioma,'#idioma')
  }
  for(var key in dict){
    var value = dict[key];
    var flag = true;
    if(value == false){
      flag = false;
      break;
    }else{
      continue;
    }
  }
  if(flag==true){
    document.getElementById("submit-info-cliente").submit();
  }
}
