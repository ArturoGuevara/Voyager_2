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
