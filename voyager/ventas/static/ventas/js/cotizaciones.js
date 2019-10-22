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

// Función para cargar la información a mostrar en el modal de resumen de cotización
function cargar_cot(){
    var checked = [];
    // Obtenemos las id de los análisis seleccionados
    $("input[name='cot[]']:checked").each(function (){
        checked.push(parseInt($(this).val()));
    });
    if(checked.length > 0){
        // Abrimos el modal porque seleccionó al menos un análisis
        $('#agregar-cot').modal('toggle');
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
                    var id = data[i].fields.id;
                    var codigo = data[i].fields.codigo;
                    var nombre = data[i].fields.nombre;
                    var precio = data[i].fields.precio;
                    $('#tabla-analisis-info').append('<tr><td>'+codigo+'</td><td>'+nombre+'</td><td>$ '+precio+'</td></tr>');
                    subtotal+= parseFloat(precio);
                }
                total = subtotal;
                // Asignar valores al input de subtotal y total
                $('#subtotal').val(subtotal);
                $('#total').val(total);
            },
            error: function(data){
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    }else{
        showNotification('top','right','Selecciona al menos un análisis para la cotización');
    }
}

// Función para guardar la nueva cotización
function crear_cotizacion(){
    var checked = [];
    // Obtenemos las id de los análisis seleccionados
    $("input[name='cot[]']:checked").each(function (){
        checked.push(parseInt($(this).val()));
    });
    // Obtenemos el token de django para el ajax
    var token = csrftoken;
    // Obtener valor de los inputs
    var cliente = $('#cliente').val();
    var subtotal = $('#subtotal').val();
    var descuento = $('#descuento').val();
    var iva = $('#iva').val();
    var total = $('#total').val();

    $.ajax({
        url: "crear_cotizacion/",
        dataType: 'json',
        // Seleccionar información que se mandara al controlador
        data: {
            cliente: cliente,
            subtotal: subtotal,
            descuento: descuento,
            iva: iva,
            total: total,
            'checked[]': checked,
            'csrfmiddlewaretoken': token
        },
        type: "POST",
        success: function(){
            // Cerramos el modal para confirmar cotización
            $('#agregar-cot').modal('hide');
            
            // Si todo salió bien esconderemos el bloque de editar y mostraremos el de editar
            $('#btn-agregar-cot').removeClass('d-none').addClass('d-inline');
            $('#container-analisis').removeClass('d-block').addClass('d-none');
            $('#container-cotizaciones').removeClass('d-none').addClass('d-block');
            $('#btn-continuar-cot').removeClass('d-inline').addClass('d-block');            
            
            // Limpiamos todos los checkboxes por si quiere agregar una nueva correctamente
            $('input:checkbox').removeAttr('checked');
            
            // Damos retroalimentación de que se guardó correctamente
            showNotification('top','right','Cotización guardada correctamente');
        },
        error: function(data){
            // Código de error alert(data.status);
            // Mensaje de error alert(data.responseJSON.error);
        }
    });
}