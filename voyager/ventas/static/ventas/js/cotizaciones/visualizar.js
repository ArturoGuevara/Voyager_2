// ######### USV04-04 ########
function visualizar_cotizacion(id) {
    // Verificar que el analisis existe
    if (id > 0) {
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
                console.log(response.error)

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
        })
    }
}

function cargar_datos_cotizacion(data_cotizacion, data_cliente, data_vendedor, analisis, analisis_cotizacion) {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html(data_cotizacion[0].pk);
    $('#fecha').html(data_cotizacion[0].fields.fecha_creada);
    $('#cliente_nombre').html(data_cliente[0].fields.nombre + ' ' + data_cliente[0].fields.apellido_paterno + ' ' + data_cliente[0].fields.apellido_materno);
    $('#vendedor').html(data_vendedor[0].fields.nombre + ' ' + data_vendedor[0].fields.apellido_paterno + ' ' + data_vendedor[0].fields.apellido_materno);
    $('#n_subtotal').html(data_cotizacion[0].fields.subtotal);
    $('#n_iva').html(data_cotizacion[0].fields.iva);
    $('#n_descuento').html(data_cotizacion[0].fields.descuento);
    $('#n_total').html(data_cotizacion[0].fields.total);
    for (n in analisis) {
        $('#analisis_tabla').append("<tr class='analisis_registro'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + analisis[n][0].fields.precio + "</td></tr>");
    }
}

function error_datos_cotizacion() {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html("");
    $('#fecha').html("");
    $('#cliente_nombre').html("");
    $('#vendedor').html("");
    $('#n_subtotal').html("");
    $('#n_iva').html("");
    $('#n_descuento').html("");
    $('#n_total').html("");
    $('#analisis_tabla').append("<tr class='analisis_registro'><td class='text-danger'> ERROR: No existen analisis en la cotizacion </td></tr>")
}