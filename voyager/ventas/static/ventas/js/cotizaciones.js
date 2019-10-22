/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se da click en el botón de editar esconder bloque de info y mostrar el de inputs
    $('#btn-agregar-cot').click(function(){
        $(this).removeClass('d-inline').addClass('d-none');
        $('#container-analisis').removeClass('d-none').addClass('d-block');
        $('#container-cotizaciones').removeClass('d-block').addClass('d-none');
        $('#btn-continuar-cot').removeClass('d-none').addClass('d-inline');
    });
    
    // Cuando se cierra el modal de bootstrap por dar click afuera, limpiar la tabla de análisis seleccionados en el resumen
    $('#agregar-cot').on('hidden.bs.modal', function () {
        $('#tabla-analisis-info').empty()
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
            var data = JSON.parse(response.info);
            var subtotal = 0;
            var total = 0;
            // Agregamos uno por uno los análisis seleccionados
            for(var i = 0; i < data.length; i++) {
                var codigo = data[i].fields.codigo;
                var nombre = data[i].fields.nombre;
                var precio = data[i].fields.precio;
                $('#tabla-analisis-info').append('<tr><td>'+codigo+'</td><td>'+nombre+'</td><td>$ '+precio+'</td></tr>');
                subtotal+= precio;
            }
            total = subtotal;
            console.log(total);
            console.log(subtotal);
            // Asignar valores al input de subtotal y total
            $('#subtotal').val(subtotal);
            $('#total').val(total);
        },
        error: function(data){
            // Código de error alert(data.status);
            // Mensaje de error alert(data.responseJSON.error);
        }
    });
}