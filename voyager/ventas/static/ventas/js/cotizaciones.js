/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se da click en el botón de editar esconder bloque de info y mostrar el de inputs
    $('#btn-agregar-cot').click(function(){
        $(this).removeClass('d-inline').addClass('d-none');
        $('#container-analisis').removeClass('d-none').addClass('d-block');
        $('#container-cotizaciones').removeClass('d-block').addClass('d-none');
        $('#btn-continuar-cot').removeClass('d-none').addClass('d-inline');
    });
});

function cargar_cot(){
    var checked = [];
    $("input[name='cot[]']:checked").each(function ()
    {
        checked.push(parseInt($(this).val()));
    });
    // Obtenemos el token de django para el ajax y el id guardada previamente al cargar el modal
    var token = csrftoken;
    $.ajax({
        url: "cargar_cot/",
        dataType: 'json',
        // Seleccionar información que se mandara al controlador
        data: {
            'checked[]': checked,
            'csrfmiddlewaretoken': token
        },
        type: "POST",
        success: function(response){
            // Obtener la info que se regresa del controlador
            var data = JSON.parse(response.data);
            console.log(response.data);
        },
        error: function(data){
            // Código de error alert(data.status);
            // Mensaje de error alert(data.responseJSON.error);
        }
    });
}