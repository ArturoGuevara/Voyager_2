/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Validar que los campos de registro de analisis no se quedan vacíos
    $("#btn-agregar-analisis").click(function(){
        $('#agregar_analisis').modal('show');
    });
});

// Validar que los campos de registro de analisis no se quedan vacíos
$("#submit-analisis-button").click(function(){
    var nombre_r = $('#nombre').val();
    var codigo_r = $('#codigo').val();
    var descripcion_r = $('#precio').val();
    var precio_r = $('#descripcion').val();
    var tiempo_r =  $('#duracion').val();

    var dict = {
        1 : check_is_not_empty(nombre_r, '#nombre'),
        3 : check_is_not_empty(codigo_r, '#codigo'),
        4 : check_is_not_empty(descripcion_r, '#precio'),
        5 : check_is_not_empty(precio_r, '#descripcion'),
        6 : check_is_not_empty(tiempo_r, '#duracion')
    }

    for(var key in dict) {
      var value = dict[key];
      var flag = true;
      if(value == false){
          flag = false
          break;
      }
    }

    if(flag == true){
        document.getElementById("submit-analisis-form").submit();
    }
});

// Agregar análisis slider range
$(function(){
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 20,
        values: [ 0, 20 ],
        slide: function( event, ui ) {
            $("#duracion").val( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " días" );
        }
    });
    $("#duracion").val( $("#slider-range").slider("values",0) + " - " + $("#slider-range").slider("values", 1) + " días");
});