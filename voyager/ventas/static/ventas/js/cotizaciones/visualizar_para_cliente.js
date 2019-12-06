$( document ).ready(function() {
    $('#terminos').hide();          // Ocultar elementos que solo aparecen para el PDF
    $('#terminos-img').hide();
});
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

                    var data_empresa = JSON.parse(response.info[5]);
                    var data_usuario = JSON.parse(response.info[6]);

                    cargar_datos_cotizacion(data_cotizacion, data_cliente, data_vendedor, analisis, analisis_cotizacion, data_empresa, data_usuario)
                }
            }
        });
    }
}

function cargar_datos_cotizacion(data_cotizacion, data_cliente, data_vendedor, analisis, analisis_cotizacion, data_empresa, data_usuario) {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html(data_cotizacion[0].pk);
    $('#fecha').html(data_cotizacion[0].fields.fecha_creada);
    $('#cliente_nombre').html(data_cliente[0].fields.nombre + ' ' + data_cliente[0].fields.apellido_paterno + ' ' + data_cliente[0].fields.apellido_materno);
    $('#vendedor').html(data_vendedor[0].fields.nombre + ' ' + data_vendedor[0].fields.apellido_paterno + ' ' + data_vendedor[0].fields.apellido_materno);
    $('#cliente_empresa').html(data_empresa[0].fields.empresa);
    $('#cliente_correo').html(data_usuario[0].fields.email);
    $('#cliente_telefono').html(data_cliente[0].fields.telefono);
    $('#n_subtotal').html(data_cotizacion[0].fields.subtotal);
    $('#n_envio').html(parseFloat(data_cotizacion[0].fields.envio));
    $('#n_total').html(data_cotizacion[0].fields.total);
    // Calcular total de descuentos e impuestos
    var tot_descuentos = 0; // Es el total de descuentos
    var aux_descuento = 0;
    var tot_iva = 0;        // Son los impuestos unicamente para los analisis
    var aux_iva = 0;
    var iva_paquete = 0;    // Es el impuesto del envio
    var iva_final = 0;      // Es el total de todos los impuestos
    for (x in analisis){
        aux_descuento = 0;
        aux_descuento = parseFloat(((analisis[x][0].fields.precio * analisis_cotizacion[x][0].fields.cantidad) / 100) * analisis_cotizacion[x][0].fields.descuento);
        aux_iva = parseFloat(((analisis[x][0].fields.precio * analisis_cotizacion[x][0].fields.cantidad) - aux_descuento) / 100 * analisis_cotizacion[x][0].fields.iva);
        tot_descuentos = tot_descuentos + aux_descuento;
        tot_iva = tot_iva + aux_iva;
    }

    iva_paquete = parseFloat(data_cotizacion[0].fields.total) - ((parseFloat(data_cotizacion[0].fields.subtotal) + parseFloat(data_cotizacion[0].fields.envio)) - tot_descuentos + tot_iva);
    iva_final = tot_iva + iva_paquete;
    if (iva_paquete == 0){
        $('#envio-span').html('Costo de envío (internacional): $ ')
    }else{
        $('#envio-span').html('Costo de envío (nacional): $ ')
    }

    $('#n_iva').html(iva_final);

    $("#editar-cot-cliente > option").each(function() {
        if($(this).val() == data_cliente[0].pk){
            $(this).attr('selected','selected');
        }
    });
    flag_no_descuento = true;
    for (n in analisis){
        if (analisis_cotizacion[n][0].fields.descuento != 0){
            flag_no_descuento = false;
        }
    }
    if (flag_no_descuento && flag_no_iva){ // Si todos los descuentos son igual a 0
        $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>Total Análisis</th><th scope='col'>Q</th></tr>");
        $('#n_descuentos').html('');
        $('#desc-span').hide();
    }else if (flag_no_descuento && !flag_no_iva){
        $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% IVA</th><th scope='col'>Total Análisis</th><th scope='col'>Q</th></tr>");
        $('#n_descuentos').html('');
        $('#desc-span').hide();
    }else if (!flag_no_descuento && flag_no_iva){
        $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% Dto.</th><th scope='col'>Total Análisis</th><th scope='col'>Q</th></tr>");
    }else{                  // Si existe al menos un descuento
        $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% Dto.</th><th scope='col'>% IVA</th><th scope='col'>Total Análisis</th><th scope='col'>Q</th></tr>");
        $('#n_descuentos').html(parseFloat(tot_descuentos));
        $('#desc-span').show();
    }

    for (n in analisis) {
        // Evaluar descuentos para cada registro
        if (flag_no_descuento && flag_no_iva){ // Si todos los descuentos son igual a 0
            $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + analisis[n][0].fields.precio +  " %</td><td> " + analisis_cotizacion[n][0].fields.total + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
        }else if (flag_no_descuento && !flag_no_iva){
            $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + analisis[n][0].fields.precio + "</td><td>+ " + parseInt(analisis_cotizacion[n][0].fields.iva) + " %</td><td>$ " + analisis_cotizacion[n][0].fields.total + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
        }else if (!flag_no_descuento && flag_no_iva){
            $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + analisis[n][0].fields.precio + "</td><td>- " + parseInt(analisis_cotizacion[n][0].fields.descuento) + " %</td><td>" +  analisis_cotizacion[n][0].fields.total + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
        }else{                  // Si existe al menos un descuento
            $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + analisis[n][0].fields.precio + "</td><td>- " + parseInt(analisis_cotizacion[n][0].fields.descuento) + " %</td><td>+ " + parseInt(analisis_cotizacion[n][0].fields.iva) + " %</td><td>$ " + analisis_cotizacion[n][0].fields.total + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
        }

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
    $('#cliente_empresa').html("");
    $('#cliente_correo').html("");
    $('#cliente_telefono').html("");
    $('#vendedor').html("");
    $('#n_subtotal').html("");
    $('#n_envio').html("");
    $('#n_total').html("");
    $('#analisis_tabla').append("<tr class='analisis_registro'><td class='text-danger'> ERROR: No existen analisis en la cotizacion </td></tr>")
}

$('#imprimir-pdf').click(function (){   // Funcion para imprimir / descargar PDF
    $('#imprimir-pdf').hide();                                          // Ocultar botones que no son necesarios para el PDF
    $('#btn-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#terminos').show();                                              // Mostrar terminos y logo para el PDF
    $('#terminos-img').show();
    var printContents = document.getElementById("pdf-content").innerHTML;   // Acciones para detonar la impresion desde el navegador
    var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents;
	window.print();
	document.body.innerHTML = originalContents;
    location.reload();
});

function check_acreditacion(analisis){
    a = analisis[0].fields.acreditacion;
    if (a){
        return "<span class='text-success'>SI</span>"
    }
    return "<span class='text-secondary'>NO</span>"
};
