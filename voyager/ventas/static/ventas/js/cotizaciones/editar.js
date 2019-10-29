// ######### USV03-03 ########

/* FUNCIONES QUE SE EJECUTAN AL CARGAR LA PÁGINA */
$(document).ready(function() {
    
});

/* FUNCIONES PARA MOSTRAR/OCULTAR LA EDICIÓN DE UNA COTIZACIÓN */
function restaurar_modal_ver_cot(){
    // Alternar botones
    $('#btn-canc-edit-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-guar-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-editar-cot').removeClass('d-none').addClass('d-inline');

    // Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-none').addClass('d-block');
    $('#editar-resumen-cot').removeClass('d-block').addClass('d-none');
    
    // Limpiar tabla de resumen de análisis al editar
    $('#editar-cot-tabla-analisis-resumen').empty();
    
    // Deseleccionamos los análisis checados en la tabla
    $("input[name='editar-cot-an[]']:checked").each(function () {
        $(this).prop('checked', false);
    });
    
    // Hacemos que la tab de información general sea la activa
    $('#nav-info-tab').removeClass().addClass('nav-item nav-link active');
    $('#nav-analisis-tab').removeClass().addClass('nav-item nav-link');
    $('#nav-info').removeClass().addClass('tab-pane fade show active');
    $('#nav-analisis').removeClass().addClass('tab-pane fade');   
}

$('#btn-editar-cot').click(function(){
    // Alternar botones
    $(this).removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-guar-editar-cot').removeClass('d-none').addClass('d-inline');

    //Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-block').addClass('d-none');
    $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
});
$('#btn-canc-edit-cot').click(function(){
    restaurar_modal_ver_cot();
    // Reiniciamos al default los valores de la cotización
    visualizar_cotizacion(id_cotizacion);
});
$('#ver_cotizacion').on('hidden.bs.modal', function () {
    restaurar_modal_ver_cot();
});

/* FUNCIONES AL EDITAR LOS ANÁLISIS DE LA COTIZACION */
function editar_cot_eliminar_an(id){
    $('.edit-cot-res-an').each(function (){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
    $('input[name="editar-cot-an[]"]').each(function (){
        if(id == $(this).data('id')){
            $(this).prop('checked', false);
        }
    });
}

$("input[name='editar-cot-an[]']").click(function (){
    // Obtenemos el checkbox que dio click
    var id = $(this).val();
    
    var flag = 0;
    // Buscamos si el análisis al que dio click ya estaba seleccionado
    $('.edit-cot-res-an').each(function (){
        if(id == $(this).data('id')){
            flag = 1;
        }
    });
    
    // Si el análisis no está en la tabla agregarlo y si sí está quitarlo
    if(flag == 0){
        // Obtenemos el token de django para el ajax
        var token = csrftoken;
        $.ajax({
            url: "cargar_analisis/"+id,
            dataType: 'json',
            // Seleccionar información que se mandara al controlador
            data: {
                id: id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(response){
                // Obtener la info que se regresa del controlador
                var data = JSON.parse(response.data);

                // Agremoas el análisis seleccionado a la tabla
                $('#editar-cot-tabla-analisis-resumen').append('<tr class="edit-cot-res-an" data-id="' + id +'"><td>' + data.fields.codigo + '</td><td>' + data.fields.nombre + '</td><td>$ ' + data.fields.precio + '</td><td><input type="number" class="form-control" id="edit-cot-an-' + id + '" data-id="' + id + '" name="editar-cot-cantidades[]"><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><button type="button" class="btn btn-danger" onclick="editar_cot_eliminar_an(' + id + ')"><i class="fa fa-trash"></i></button></td></tr>');
            },
            error: function (data) {
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    }else{
        $('.edit-cot-res-an').each(function (){
            if(id == $(this).data('id')){
                $(this).remove();
            }
        });
    }
});