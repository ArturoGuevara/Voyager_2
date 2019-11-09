// ######### USV04-04 ########
function visualizar_cotizacion(id) {
    // Verificar que el analisis existe
    if (id > 0) {
        id_cotizacion = id;
        // Obtenemos el token de django para el ajax y el id guardada previamente al cargar el modal
        var token = csrftoken;
        $.ajax({
            url: "visualizar_cotizacion/" + id,
            dataType: 'json',
            // Seleccionar información que se mandara al controlador
            data: {
                id: id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function (response) {
                if (response.error == "La cotización no contiene analisis") {
                    error_datos_cotizacion();
                } else {
                    var data_cotizacion = JSON.parse(response.info[0]);
                    var data_cliente = JSON.parse(response.info[1]);
                    var data_vendedor = JSON.parse(response.info[2]);
                    var aux_analisis = response.info[3]
                    var aux_analisis_cotizacion = response.info[4];

                    analisis = []
                    for (registro in aux_analisis) {
                        n_analisis = JSON.parse(aux_analisis[registro]);
                        analisis.push(n_analisis);
                    }
                    analisis_cotizacion = []
                    for (registro in aux_analisis_cotizacion) {
                        n_analisis_cotizacion = JSON.parse(aux_analisis_cotizacion[registro]);
                        analisis_cotizacion.push(n_analisis_cotizacion);
                    }
                    cargar_datos_cotizacion(data_cotizacion, data_cliente, data_vendedor, analisis, analisis_cotizacion)
                }
            }
        });
    }
}

function cargar_datos_cotizacion(data_cotizacion, data_cliente, data_vendedor, analisis, analisis_cotizacion) {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html(data_cotizacion[0].pk);
    $('#fecha').html(data_cotizacion[0].fields.fecha_creada);
    $('#cliente_nombre').html(data_cliente[0].fields.nombre + ' ' + data_cliente[0].fields.apellido_paterno + ' ' + data_cliente[0].fields.apellido_materno);
    $('#vendedor').html(data_vendedor[0].fields.nombre + ' ' + data_vendedor[0].fields.apellido_paterno + ' ' + data_vendedor[0].fields.apellido_materno);
    $('#n_subtotal').html(data_cotizacion[0].fields.subtotal);
    $('#n_envio').html(parseFloat(data_cotizacion[0].fields.envio));
    $('#n_total').html(data_cotizacion[0].fields.total);

    $("#editar-cot-cliente > option").each(function() {
        if($(this).val() == data_cliente[0].pk){
            $(this).attr('selected','selected');
        }
    });

    for (n in analisis) {
        $('#analisis_tabla').append("<tr class='analisis_registro'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$" + analisis[n][0].fields.precio + "</td><td> " + parseInt(analisis_cotizacion[n][0].fields.descuento) + "</td><td> " + parseInt(analisis_cotizacion[n][0].fields.iva) + "</td><td> " + analisis_cotizacion[n][0].fields.total + "</td></tr>");

        // Precargamos los inputs de la cotización
        $('#editar-cot-tabla-analisis-resumen').append('<tr class="edit-cot-res-an" data-id="' + analisis[n][0].pk + '"><td>' + analisis[n][0].fields.codigo + '</td><td>' + analisis[n][0].fields.nombre + '</td><td><input id="edit-cot-pr-' + analisis[n][0].pk + '" name="edit-cot-precios[]" value='+ analisis[n][0].fields.precio +' hidden>$' + analisis[n][0].fields.precio + '</td><td><input type="number" class="form-control" id="edit-cot-an-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="editar-cot-cantidades[]" onchange="calc_total()" min=1 value="'+analisis_cotizacion[n][0].fields.cantidad+'"><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><input type="number" class="form-control" id="edit-cot-de-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-descuentos[]" min=0 value='+parseInt(analisis_cotizacion[n][0].fields.descuento)+' onchange="calc_total()"></td><td><input type="number" class="form-control" id="edit-cot-iva-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-ivas[]" min=0 value='+parseInt(analisis_cotizacion[n][0].fields.iva)+' onchange="calc_total()"></td><td><input type="number" class="form-control" id="edit-cot-to-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-totales[]" value='+ analisis_cotizacion[n][0].fields.total +' readonly></td><td><button type="button" class="btn btn-danger" onclick="editar_cot_eliminar_an(' + analisis[n][0].pk + ')"><i class="fa fa-trash"></i></button></td></tr>');
        $('#editar-cot-subtotal').val(data_cotizacion[0].fields.subtotal);
        $('#editar-cot-envio').val(data_cotizacion[0].fields.envio);
        $('#editar-cot-total').val(data_cotizacion[0].fields.total);

        // A los análisis que ya están seleccionados les marcaremos su checkbox marcado
        $('input[name="editar-cot-an[]"]').each(function (){
            var id = $(this).data('id');
            if(id == analisis[n][0].pk){
                $(this).prop('checked', true);
            }
        });
    }
}

function error_datos_cotizacion() {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html("");
    $('#fecha').html("");
    $('#cliente_nombre').html("");
    $('#vendedor').html("");
    $('#n_subtotal').html("");
    $('#n_envio').html("");
    $('#n_total').html("");
    $('#analisis_tabla').append("<tr class='analisis_registro'><td class='text-danger'> ERROR: No existen analisis en la cotizacion </td></tr>")
}
