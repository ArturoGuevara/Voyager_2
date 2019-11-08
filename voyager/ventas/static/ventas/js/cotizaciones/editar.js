// ######### USV03-03 ########

/* FUNCIONES QUE SE EJECUTAN AL CARGAR LA PÁGINA */
$(document).ready(function() {
    $('#editar-cot-descuento').on("change", calc_total);
    $('#editar-cot-iva').on("change", calc_total);
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
    $('#btn-confirm-editar-cot').removeClass('d-none').addClass('d-inline');

    //Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-block').addClass('d-none');
    $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
});
$('#btn-canc-edit-cot').click(function(){
    restaurar_modal_ver_cot();
    $('#confirm-edit-cot').removeClass('d-block').addClass('d-none');
    $('#btn-confirm-editar-cot').removeClass('d-inline').addClass('d-none');
    // Reiniciamos al default los valores de la cotización
    visualizar_cotizacion(id_cotizacion);
});

// Boton para cancelar
$('#btn-canc-edit-cot-2').click(function(){
    $('#confirm-edit-cot').removeClass('d-block').addClass('d-none');
    $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
    $('#btn-confirm-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot-2').removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-guar-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-confirm-editar-cot').removeClass('d-none').addClass('d-inline');

});
$('#ver_cotizacion').on('hidden.bs.modal', function () {
    restaurar_modal_ver_cot();
    $('#confirm-edit-cot').removeClass('d-block').addClass('d-none');
    $('#btn-confirm-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot-2').removeClass('d-inline').addClass('d-none');
    // Restauramos la variable global que almacena la id de la cotización clickeada
    id_cotizacion = 0;
});

// Confirmacion para editar COTIZACION
function solicitar_confirmacion_cot(){
    var cliente = $('#editar-cot-cliente').val();
    var subtotal = $('#editar-cot-subtotal').val();
    var descuento = $('#editar-cot-descuento').val();
    var iva = $('#editar-cot-iva').val();
    var total = $('#editar-cot-total').val();

    // Variables que no necesitan verificacion porque no se pueden editar
    var fecha = $('#fecha').html();
    var vendedor = $('#vendedor').html();
    var cliente_text = $('#editar-cot-cliente option:selected').text();
    $('#editar-cot-tabla-analisis-resumen').find('tr').each(function () {
        console.log(this);
    });
    // Validamos que no estén vacíos los inputs
    var dict_editar_cot = {
        1 : check_is_not_empty(cliente, '#editar-cot-cliente'),
        3 : check_is_not_empty(subtotal, '#editar-cot-subtotal'),
        4 : check_is_not_empty(descuento, '#editar-cot-descuento'),
        5 : check_is_not_empty(iva, '#editar-cot-iva'),
        6 : check_is_not_empty(total, '#editar-cot-total')
    }

    for(var key in dict_editar_cot) {
      var value = dict_editar_cot[key];
      var flag = true;
      if(value == false){
          flag = false
          break;
      }
    }

    if (flag){
        $('#editar-resumen-cot').removeClass('d-block').addClass('d-none');
        $('#confirm-edit-cot').removeClass('d-none').addClass('d-block');
        $('#btn-confirm-editar-cot').removeClass('d-inline').addClass('d-none');
        $('#btn-guar-editar-cot').removeClass('d-none').addClass('d-inline');
        $('#btn-canc-edit-cot').removeClass('d-inline').addClass('d-none');
        $('#btn-canc-edit-cot-2').removeClass('d-none').addClass('d-inline');
    }

    // Cargamos la informacion al display de retroalimentacion
    $('#fecha-confirm-edit-cot').html(fecha);
    $('#cliente_nombre-confirm-edit-cot').html(cliente_text);
    $('#vendedor-confirm-edit-cot').html(vendedor);
    $('#n_subtotal-confirm-edit-cot').html(subtotal);
    $('#n_iva-confirm-edit-cot').html(iva);
    $('#n_descuento-confirm-edit-cot').html(descuento);
    $('#n_total-confirm-edit-cot').html(total);

}

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
                $('#editar-cot-tabla-analisis-resumen').append('<tr class="edit-cot-res-an" data-id="' + id +'"><td>' + data.fields.codigo + '</td><td>' + data.fields.nombre + '</td><td><input id="edit-cot-pr-' + id + '" name="editar-cot-precios[]" value='+data.fields.precio +' hidden>$ ' + data.fields.precio + '</td><td><input type="number" class="form-control" id="edit-cot-an-' + id + '" data-id="' + id + '" name="editar-cot-cantidades[]" onchange="calc_total()" min=1 value=1><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><button type="button" class="btn btn-danger" onclick="editar_cot_eliminar_an(' + id + ')"><i class="fa fa-trash"></i></button></td></tr>');
                calc_total();
            },
        });
    }else{
        $('.edit-cot-res-an').each(function (){
            if(id == $(this).data('id')){
                $(this).remove();
            }
        });
    }
});

/* FUNCIONES PARA GUARDAR LOS CAMBIOS DE LA COTIZACIÓN */
// Función para guardar los cambios
function guardar_cambios_cot(){
    if(id_cotizacion > 0){
        var checked = [];
        var cantidades = [];
        // Obtenemos las id de los análisis seleccionados
        $("input[name='editar-cot-an[]']:checked").each(function () {
            checked.push(parseInt($(this).val()));
        });
        // Obtenemos las cantidades de los análisis seleccionados
        $("input[name='editar-cot-cantidades[]']").each(function () {
            cantidades.push(parseInt($(this).val()));
            // Checamos que no estén vacíos los inputs de cantidad
            var id = $(this).data('id');
            check_is_not_empty($(this).val(), "#edit-cot-an-" + id + "");
        });
        // Obtenemos el token de django para el ajax
        var token = csrftoken;
        // Obtener valor de los inputs
        var cliente = $('#editar-cot-cliente').val();
        var subtotal = $('#editar-cot-subtotal').val();
        var descuento = $('#editar-cot-descuento').val();
        var iva = $('#editar-cot-iva').val();
        var total = $('#editar-cot-total').val();

        // Validamos que no estén vacíos los inputs
        check_is_not_empty(cliente, '#editar-cot-cliente');
        check_is_not_empty(subtotal, '#editar-cot-subtotal');
        check_is_not_empty(descuento, '#editar-cot-descuento');
        check_is_not_empty(iva, '#editar-cot-iva');
        check_is_not_empty(total, '#editar-cot-total');

        if(checked.length != 0){
            $.ajax({
                url: "actualizar_cotizacion/"+id_cotizacion,
                dataType: 'json',
                // Seleccionar información que se mandara al controlador
                data: {
                    cliente: cliente,
                    subtotal: subtotal,
                    descuento: descuento,
                    iva: iva,
                    total: total,
                    'checked[]': checked,
                    'cantidades[]': cantidades,
                    'csrfmiddlewaretoken': token
                },
                type: "POST",
                success: function (response) {
                    // Cerramos el modal para confirmar cotización

                    $('#ver_cotizacion').modal('hide');
                    $('#confirm-edit-cot').removeClass('d-block').addClass('d-none');
                    // Damos retroalimentación de que se guardó correctamente
                    showNotification('top', 'right', 'Cambios en la cotización guardados correctamente');

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
    $("input[name='editar-cot-precios[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        pr.push(val);
    });
    var sub = document.getElementById("editar-cot-subtotal");
    var total = document.getElementById("editar-cot-total");
    var iva = document.getElementById("editar-cot-iva");
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
        subtotal = subtotal + precios[i];
        console.log(p);
        i = i + 1;
    }
    console.log(subtotal);
    sub.value = subtotal;
    total.value = sub.value;
    var desc = document.getElementById("editar-cot-descuento");
    var d = parseInt(desc.value) / 100;
    var t = parseInt(total.value);
    var temp = t * d;
    var tot = t - temp;
    var ivaa = parseInt(iva.value) / 100;
    ivaa = tot * ivaa;
    tot = tot + ivaa;
    total.value = tot;
}
