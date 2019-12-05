// ######### USV03-03 ########

/* FUNCIONES PARA MOSTRAR/OCULTAR LA EDICIÓN DE UNA COTIZACIÓN */
function restaurar_modal_ver_cot(){
    // Alternar botones
    $('#btn-canc-edit-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-guar-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-editar-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-space-edit').removeClass('d-none');

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

    $('#imprimir-pdf').show();
}
$('#btn-editar-cot').click(function(){
    // Alternar botones
    $('#imprimir-pdf').hide();
    $("input[name='editar-cot-an[]']:checked").each(function () {
        che.push(parseInt($(this).val()));
    });
    $(this).removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-guar-editar-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-space-edit').addClass('d-none');

    //Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-block').addClass('d-none');
    $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
});
$('#btn-canc-edit-cot').click(function(){
    restaurar_modal_ver_cot();
    // Reiniciamos al default los valores de la cotización
    visualizar_cotizacion(id_cotizacion);
    // Se reinicia el arreglo de Análisis
    che = [];
});
$('#ver_cotizacion').on('hidden.bs.modal', function () {
    restaurar_modal_ver_cot();
    // Restauramos la variable global que almacena la id de la cotización clickeada y los Análisis
    id_cotizacion = 0;
    che = [];
});

/* FUNCIONES AL EDITAR LOS ANÁLISIS DE LA COTIZACION */
// Cuando el usuario decide eliminar un análisis del resumen
function editar_cot_eliminar_an(id){
    $('.edit-cot-res-an').each(function (){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
    $('input[name="editar-cot-an[]"]').each(function (){
        if(id == $(this).data('id')){
            $(this).prop('checked', false);
            for(var i = 0; i < che.length; i++){
              if ( che[i] === id) {
                che.splice(i, 1);
              }
            }
        }
    });
    calc_total();
}
// Cuando el usuario clickea en algún checkbox para agregarlo al resumen
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
        che.push(parseInt($(this).val()));
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
                var data = JSON.parse(response.data[0]);
                data = data[0];
                var total_analisis = parseInt(data.fields.precio) + (parseInt(data.fields.precio) * 0.16)

                // Agremoas el análisis seleccionado a la tabla
                $('#editar-cot-tabla-analisis-resumen').append('<tr class="edit-cot-res-an" data-id="' + id +'"><td>' + data.fields.codigo + '</td><td>' + data.fields.nombre + '</td><td><input id="edit-cot-pr-' + id + '" name="edit-cot-precios[]" value='+ data.fields.precio +' hidden>$' + data.fields.precio + '</td><td><input type="number" class="form-control" id="edit-cot-an-' + id + '" data-id="' + id + '" name="editar-cot-cantidades[]" onchange="calc_total()" min=1 value=1><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><input type="number" class="form-control" id="edit-cot-de-' + id + '" data-id="' + id + '" name="edit-cot-descuentos[]" min=0 value=0 onchange="calc_total()"></td><td><input type="number" class="form-control" id="edit-cot-iva-' + id + '" data-id="' + id + '" name="edit-cot-ivas[]" min=0 value=16 onchange="calc_total()"></td><td><input type="number" class="form-control" id="edit-cot-to-' + id + '" data-id="' + id + '" name="edit-cot-totales[]" value='+ total_analisis +' readonly></td><td><button type="button" class="btn btn-danger" onclick="editar_cot_eliminar_an(' + id + ')"><i class="fa fa-trash"></i></button></td></tr>');
                calc_total();
            },
        });
    }else{
        $('.edit-cot-res-an').each(function (){
            if(id == $(this).data('id')){
                $(this).remove();
            }
        });
        for(var i = 0; i < che.length; i++){
          if ( che[i] === parseInt(id)) {
            che.splice(i, 1);
          }
        }
        calc_total();
    }
});

/* FUNCIONES PARA GUARDAR LOS CAMBIOS DE LA COTIZACIÓN */
// Función para guardar los cambios
function guardar_cambios_cot(){
    if(id_cotizacion > 0){
        var checked = [];
        var cantidades = [];
        var descuentos = [];
        var ivas = [];
        var totales = [];

        checked = che;
        che = [];
        // Obtenemos las id de los análisis seleccionados
        // $("input[name='editar-cot-an[]']:checked").each(function () {
        //     checked.push(parseInt($(this).val()));
        // });
        // Obtenemos las cantidades de los análisis seleccionados
        $("input[name='editar-cot-cantidades[]']").each(function () {
            cantidades.push(parseInt($(this).val()));
            // Checamos que no estén vacíos los inputs de cantidad
            var id = $(this).data('id');
            check_is_not_empty($(this).val(), "#edit-cot-an-" + id + "");
        });
        $("input[name='edit-cot-descuentos[]").each(function () {
            descuentos.push(parseInt($(this).val()));
        });
        $("input[name='edit-cot-ivas[]").each(function () {
            ivas.push(parseInt($(this).val()));
        });
        $("input[name='edit-cot-totales[]").each(function () {
            totales.push(parseFloat($(this).val()));
        });
        // Obtenemos el token de django para el ajax
        var token = csrftoken;
        // Obtener valor de los inputs
        var cliente = $('#editar-cot-cliente').val();
        var envio = $('#editar-cot-envio').val();
        var subtotal = $('#editar-cot-subtotal').val();
        var total = $('#editar-cot-total').val();

        // Validamos que no estén vacíos los inputs
        check_is_not_empty(cliente, '#editar-cot-cliente');
        check_is_not_empty(subtotal, '#editar-cot-subtotal');
        check_is_not_empty(total, '#editar-cot-total');

        if(checked.length != 0){
            $.ajax({
                url: "actualizar_cotizacion/"+id_cotizacion,
                dataType: 'json',
                // Seleccionar información que se mandara al controlador
                data: {
                    cliente: cliente,
                    subtotal: subtotal,
                    total: total,
                    envio: envio,
                    'checked[]': checked,
                    'cantidades[]': cantidades,
                    'descuentos[]': descuentos,
                    'ivas[]': ivas,
                    'totales[]': totales,
                    'csrfmiddlewaretoken': token
                },
                type: "POST",
                success: function (response) {
                    // Cerramos el modal para confirmar cotización
                    $('#ver_cotizacion').modal('hide');

                    // Damos retroalimentación de que se guardó correctamente
                    showNotificationSuccess('top', 'right', 'Cambios en la cotización guardados correctamente');
                    showNotificationWarning('top', 'right', 'Se refrescará la página');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                },
                error: function (data) {
                    // Código de error alert(data.status);
                    // Mensaje de error alert(data.responseJSON.error);
                }
            });
        }else{
            $('#alert-error-edit-cot').removeClass('d-none').addClass('d-block');
            setTimeout(function () {
                $('#alert-error-edit-cot').removeClass('d-block').addClass('d-none');
            }, 2000);
        }
    }
}
function calc_total() {
    var pr = [];
    $("input[name='edit-cot-precios[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        pr.push(val);
    });
    var iva = [];
    $("input[name='edit-cot-ivas[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        if(val < 1){
            val = val*-1;
            if(val > 100){
                val = 100;
                $(this).val(val);
            }
            $(this).val(val);
        }
        else if(val > 100){
            val = 100;
            $(this).val(val);
        }
        else if(isNaN(val)){
            val = 0;
            $(this).val(val);
        }
        iva.push(val);
    });
    var desc = [];
    $("input[name='edit-cot-descuentos[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        if(val < 1){
            val = val*-1;
            if(val > 100){
                val = 100;
                $(this).val(val);
            }
            $(this).val(val);
        }
        else if(val > 100){
            val = 100;
            $(this).val(val);
        }
        else if(isNaN(val)){
            val = 0;
            $(this).val(val);
        }
        desc.push(val);
    });
    var tots = [];
    $("input[name='edit-cot-totales[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        tots.push(val);
    });
    var sub = document.getElementById("editar-cot-subtotal");
    var total = document.getElementById("editar-cot-total");
    var envio = document.getElementById("editar-cot-envio");
    var precios = [];
    var i = 0;
    $("input[name='editar-cot-cantidades[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs de cantidad

        var val = $(this).val();
        if(val < 1){
            val = val*-1;
            if(val == 0){
                val = 1;
            }
            $(this).val(val);
        }
        var temp = pr[i] * val;
        precios.push(temp);
        i = i+1;
    });
    var subtotal = 0;
    i = 0;
    for (p in precios) {
        desc[i] = desc[i] / 100;
        var temp = precios[i] - (precios[i] * desc[i]);
        iva[i] = iva[i] / 100;
        temp = temp + (temp * iva[i]);
        tots[i] = temp;
        subtotal = subtotal + tots[i];
        i = i + 1;
    }

    var subtotal_2 = 0;
    for (x in precios) {
        subtotal_2 = subtotal_2 + precios[x];
    }
    i = 0;
    $("input[name='edit-cot-totales[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        $(this).val(tots[i]);
        i = i + 1;
    });
    //sub.value = subtotal;
    sub.value = subtotal_2;
    if (envio.value < 1) {
        envio.value = envio.value * -1;
    }

    var tipo_envio = $('#tipo-envio-edit option:selected').text();
    
    if (tipo_envio == 'Internacional'){
        total.value = (subtotal + parseInt(envio.value)).toFixed(2);
    }else{
        total.value = (subtotal + (parseFloat(envio.value) * 1.16)).toFixed(2);
    }
}
