var tabla2_checked = [];

$( document ).ready(function() {
    $('#terminos').hide();          // Ocultar elementos que solo aparecen para el PDF
    $('#terminos-img').hide();

    $('.cotizaciones_total').each(function(){
        $(this).text( numberWithCommas( $(this).text() ) );
    });


});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function refresh_check(){
    $("input[name='cot[]']").each(function () {
        if (tabla2_checked.includes($(this).val())){
            $(this).prop('checked', true);
        }
        else {
            $(this).prop('checked', false);
        }
    });
}

function edit_refresh_check(){
    $("input[name='editar-cot-an[]']").each(function () {
        if (che.includes(parseInt($(this).val()))){
            $(this).prop('checked', true);
        }
        else {
            $(this).prop('checked', false);
        }
    });
}

function analisis_cot(id){
    if (tabla2_checked.includes(id)){
        let i = 0;
        while(true){
            if (tabla2_checked[i] == id){
                tabla2_checked.splice(i, 1);
                break;
            }
            i++;
        }
    }
    else {
        tabla2_checked.push(id);
    }
}

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
    var fecha = data_cotizacion[0].fields.fecha_creada;
    var parts = fecha.split('-');
    $('#fecha').html(parts[2]+"/"+parts[1]+"/"+parts[0]);
    var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    mydate.setMonth(mydate.getMonth()+1);
    var newMonth = mydate.getMonth() +1;
    $('#fecha_vigencia').html(mydate.getDate()+"/"+newMonth+"/"+mydate.getFullYear());
    $('#cliente_nombre').html(data_cliente[0].fields.nombre + ' ' + data_cliente[0].fields.apellido_paterno + ' ' + data_cliente[0].fields.apellido_materno);
    $('#vendedor').html(data_vendedor[0].fields.nombre + ' ' + data_vendedor[0].fields.apellido_paterno + ' ' + data_vendedor[0].fields.apellido_materno);
    $('#cliente_empresa').html(data_empresa[0].fields.empresa);
    $('#cliente_correo').html(data_usuario[0].fields.email);
    $('#cliente_telefono').html(data_cliente[0].fields.telefono);
    $('#n_subtotal').html(  numberWithCommas(data_cotizacion[0].fields.subtotal)   );
    $('#n_envio').html(  numberWithCommas(parseFloat(data_cotizacion[0].fields.envio).toFixed(2))  );
    $('#n_total').html(  numberWithCommas( data_cotizacion[0].fields.total  ) );
    var bloqueado = data_cotizacion[0].fields.bloqueado;
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

    $('#n_iva').html(numberWithCommas(iva_final.toFixed(2)));

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
    flag_no_iva = true;
        for (n in analisis){
            if (analisis_cotizacion[n][0].fields.iva != 16){
                flag_no_iva = false;
            }
        }
        // Evaluar descuentos y el IVA para el encabezad
        if (flag_no_descuento && flag_no_iva){ // Si todos los descuentos son igual a 0
            $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>Total Análisis</th><th scope='col'>Q*</th></tr>");
            $('#n_descuentos').html('');
            $('#desc-span').hide();
        }else if (flag_no_descuento && !flag_no_iva){
            $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% IVA</th><th scope='col'>Total Análisis</th><th scope='col'>Q*</th></tr>");
            $('#n_descuentos').html('');
            $('#desc-span').hide();
        }else if (!flag_no_descuento && flag_no_iva){
            $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% Dto.</th><th scope='col'>Total Análisis</th><th scope='col'>Q*</th></tr>");
            $('#n_descuentos').html(parseFloat(tot_descuentos));
            $('#desc-span').show();
        }else{                  // Si existe al menos un descuento
            $('.tabla-analisis-encabezado').html("<tr><th scope='col'>Código</th><th scope='col'>Nombre</th><th scope='col'>Descripción</th><th scope='col'>Duración</th><th scope='col'>Cantidad</th><th scope='col'>Precio Unitario</th><th scope='col'>% Dto.</th><th scope='col'>% IVA</th><th scope='col'>Total Análisis</th><th scope='col'>Q*</th></tr>");
            $('#n_descuentos').html(parseFloat(tot_descuentos));
            $('#desc-span').show();
        }

        for (n in analisis) {
            // Evaluar descuentos para cada registro
            if (flag_no_descuento && flag_no_iva){ // Si todos los descuentos son igual a 0
                $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + numberWithCommas(analisis[n][0].fields.precio) +  "</td><td>$ " + numberWithCommas(analisis_cotizacion[n][0].fields.total) + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
            }else if (flag_no_descuento && !flag_no_iva){
                $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + numberWithCommas(analisis[n][0].fields.precio) + "</td><td>+ " + parseInt(analisis_cotizacion[n][0].fields.iva) + " %</td><td>$ " + numberWithCommas(analisis_cotizacion[n][0].fields.total) + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
            }else if (!flag_no_descuento && flag_no_iva){
                $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + numberWithCommas(analisis[n][0].fields.precio) + "</td><td>- " + parseInt(analisis_cotizacion[n][0].fields.descuento) + " %</td><td>$ " +  numberWithCommas(analisis_cotizacion[n][0].fields.total )+ "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
            }else{                  // Si existe al menos un descuento
                $('#analisis_tabla').append("<tr class='analisis_registro' style='font-size: 10px;'><td>" + analisis[n][0].fields.codigo + "</td><td>" + analisis[n][0].fields.nombre + "</td><td>"+ analisis[n][0].fields.descripcion +"</td><td>"+ analisis[n][0].fields.tiempo +"</td><td>" + analisis_cotizacion[n][0].fields.cantidad + "</td><td>$ " + numberWithCommas(analisis[n][0].fields.precio) + "</td><td>- " + parseInt(analisis_cotizacion[n][0].fields.descuento) + " %</td><td>+ " + parseInt(analisis_cotizacion[n][0].fields.iva) + " %</td><td>$ " + numberWithCommas(analisis_cotizacion[n][0].fields.total) + "</td><td>"+check_acreditacion(analisis[n])+"</td></tr>");
            }


        // Precargamos los inputs de la cotización
        $('#editar-cot-tabla-analisis-resumen').append('<tr class="edit-cot-res-an" data-id="' + analisis[n][0].pk + '"><td>' + analisis[n][0].fields.codigo + '</td><td>' + analisis[n][0].fields.nombre + '</td><td><input id="edit-cot-pr-' + analisis[n][0].pk + '" name="edit-cot-precios[]" value='+ analisis[n][0].fields.precio +' hidden>$' + analisis[n][0].fields.precio + '</td><td><input type="number" class="form-control" id="edit-cot-an-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="editar-cot-cantidades[]" onchange="calc_total()" min=1 value="'+analisis_cotizacion[n][0].fields.cantidad+'" style="width: 75px;"><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><input type="number" class="form-control" id="edit-cot-de-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-descuentos[]" min=0 value='+parseInt(analisis_cotizacion[n][0].fields.descuento)+' onchange="calc_total()" style="width: 100px;"></td><td><input type="number" class="form-control" id="edit-cot-iva-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-ivas[]" min=0 value='+parseInt(analisis_cotizacion[n][0].fields.iva)+' onchange="calc_total()" style="width: 60px;"></td><td><input type="number" class="form-control" id="edit-cot-to-' + analisis[n][0].pk + '" data-id="' + analisis[n][0].pk + '" name="edit-cot-totales[]" value='+ analisis_cotizacion[n][0].fields.total +' style="width: 100px;" readonly></td><td><button type="button" class="btn btn-danger" onclick="editar_cot_eliminar_an(' + analisis[n][0].pk + ')"><i class="fa fa-trash"></i></button></td></tr>');
        $('#editar-cot-subtotal').val(numberWithCommas( data_cotizacion[0].fields.subtotal) );
        $('#editar-cot-envio').val(numberWithCommas(data_cotizacion[0].fields.envio));
        $('#editar-cot-total').val(numberWithCommas( data_cotizacion[0].fields.total) );

        // A los análisis que ya están seleccionados les marcaremos su checkbox marcado
        $('input[name="editar-cot-an[]"]').each(function (){
            var id = $(this).data('id');
            if(id == analisis[n][0].pk){
                $(this).prop('checked', true);
            }
        });

        che.push(analisis[n][0].pk);

    }

    if (data_cotizacion[0].fields.aceptado || data_cotizacion[0].fields.bloqueado){
      $('#btn-editar-cot').remove();
    }
    else if ($('#btn-editar-cot').length == 0){
      var boton = $('<button id="btn-editar-cot" class="btn btn-info d-inline">Editar</button>');
      $('#btn-espacio').append(boton);
      $('#btn-editar-cot').click(function(){

          // $("input[name='editar-cot-an[]']:checked").each(function () {
          //     che.push(parseInt($(this).val()));
          // });

          // Alternar botones
          $(this).removeClass('d-inline').addClass('d-none');
          $('#btn-space-edit').addClass('d-none');
          $('#btn-canc-edit-cot').removeClass('d-none').addClass('d-inline');
          $('#btn-guar-editar-cot').removeClass('d-none').addClass('d-inline');

          //Alternar contenedores
          $('#ver-resumen-cot').removeClass('d-block').addClass('d-none');
          $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
      });
    }

    //Validar si la cotización está bloqueada o no
    if(bloqueado == true){
      $('#imprimir-pdf').hide();
      $('#pdf').hide();
    }else{
      bloqueado = true
    }

}

function error_datos_cotizacion() {
    $('.analisis_registro').remove();
    $('#ver_id_cot').html("");
    $('#fecha').html("");
    $('#fecha_vigencia').html("");
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
    //Nombre para el documento
	var fecha = document.getElementById('fecha').innerHTML;
	var num_cotizacion = document.getElementById('ver_id_cot').innerHTML;
	var usuario = document.getElementById('cliente_nombre').innerHTML;
	var nombre = fecha + "_" + num_cotizacion + "_" + usuario;

    $('#imprimir-pdf').hide();                                          // Ocultar botones que no son necesarios para el PDF
    $('#btn-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#terminos').show();                                              // Mostrar terminos y logo para el PDF
    $('#terminos-img').show();
    var printContents = document.getElementById("pdf-content").innerHTML;   // Acciones para detonar la impresion desde el navegador
    var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents;
	document.title = nombre; // Asignar nombre del documento a imprimir (no funciona en Firefox)
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
