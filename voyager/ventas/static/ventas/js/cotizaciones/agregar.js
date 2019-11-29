// ######### USV01-01 ########

/* VARIABLES GLOBALES */
var id_cotizacion = 0;
var cantidad;
var che = [];
/* FUNCIONES QUE SE EJECUTAN AL CARGAR LA PÁGINA */
$(document).ready(function () {
    // Cuando se cierra el modal de bootstrap por dar click afuera, limpiar la tabla de análisis seleccionados en el resumen
    $('#agregar-cot').on('hidden.bs.modal', function () {
        $('#tabla-analisis-info').empty()
    });
});

/* FUNCIONES PARA CREAR COTIZACIÓN */
// Función para cargar el resumen de cotización
function cargar_cot() {
    var checked = [];
    // Obtenemos las id de los análisis seleccionados
    $("input[name='cot[]']:checked").each(function () {
        checked.push(parseInt($(this).val()));
    });
    if (checked.length > 0) {
        // Abrimos el modal porque seleccionó al menos un análisis
        $('#agregar-cot').modal('toggle');
        // Obtenemos el token de django para el ajax
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
            success: function (response) {
                // Obtener la info que se regresa del controlador
                var data = JSON.parse(response.info);
                var subtotal = 0;
                var total = 0;
                // Agregamos uno por uno los análisis seleccionados
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var codigo = data[i].fields.codigo;
                    var nombre = data[i].fields.nombre;
                    var precio = data[i].fields.precio;
                    var total_analisis = parseInt(precio) + (parseInt(precio) * 0.16)
                    $('#tabla-analisis-info').append('<tr><td>' + codigo + '</td><td>' + nombre + '</td><td><input id="res-cot-pr-' + id + '" name="precios[]" value='+precio+' hidden>$' + precio + '</td><td><input type="number" class="form-control" id="res-cot-an-' + id + '" data-id="' + id + '" name="cantidades[]" min=1 value=1 onchange="add_calc_total()"><div class="invalid-feedback">Por favor introduce una cantidad</div></td><td><input type="number" class="form-control" id="res-cot-an-' + id + '" data-id="' + id + '" name="descuentos[]" min=0 value=0 onchange="add_calc_total()"></td><td><input type="number" class="form-control" id="res-cot-an-' + id + '" data-id="' + id + '" name="ivas[]" min=0 value=16 onchange="add_calc_total()"></td><td><input type="number" class="form-control" id="res-cot-an-' + id + '" data-id="' + id + '" name="totales[]" value='+ total_analisis +' readonly></td></tr>');
                    subtotal += parseFloat(total_analisis);
                }
                total = subtotal;
                // Asignar valores al input de subtotal y total
                $('#subtotal').val(subtotal);
                $('#total').val(total);
            },
            error: function (data) {
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    } else {
        showNotificationWarning('top', 'right', 'Selecciona al menos un análisis para la cotización');
    }
}
// Función para guardar la nueva cotización
function crear_cotizacion() {
    var checked = [];
    var cantidades = [];
    var descuentos = [];
    var ivas = [];
    var totales = [];
    // Obtenemos las id de los análisis seleccionados
    $("input[name='cot[]']:checked").each(function () {
        checked.push(parseInt($(this).val()));
    });
    // Obtenemos las cantidades de los análisis seleccionados
    $("input[name='cantidades[]']").each(function () {
        cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs de cantidad
        var id = $(this).data('id');
        check_is_not_empty($(this).val(), "#res-cot-an-" + id + "");
    });
    $("input[name='descuentos[]").each(function () {
        descuentos.push(parseInt($(this).val()));
    });
    $("input[name='ivas[]").each(function () {
        ivas.push(parseInt($(this).val()));
    });
    $("input[name='totales[]").each(function () {
        totales.push(parseFloat($(this).val()));
    });
    // Obtenemos el token de django para el ajax
    var token = csrftoken;
    // Obtener valor de los inputs
    var cliente = $('#cliente').val();
    var subtotal = $('#subtotal').val();
    var envio = $('#envio').val();
    var total = $('#total').val();

    // Validamos que no estén vacíos los inputs
    check_is_not_empty(cliente, '#cliente');
    check_is_not_empty(subtotal, '#subtotal');
    check_is_not_empty(total, '#total');

    $.ajax({
        url: "crear_cotizacion/",
        dataType: 'json',
        // Seleccionar información que se mandara al controlador
        data: {
            cliente: cliente,
            subtotal: subtotal,
            total: total,
            envio: envio,
            'checked[]': checked,
            'cantidades[]': cantidades,
            'ivas[]': ivas,
            'descuentos[]': descuentos,
            'totales[]': totales,
            'csrfmiddlewaretoken': token
        },
        type: "POST",
        success: function (response) {
            // Cerramos el modal para confirmar cotización
            $('#agregar-cot').modal('hide');

            // Damos retroalimentación de que se guardó correctamente
            showNotificationSuccess('top', 'right', 'Cotización guardada correctamente');
            showNotificationWarning('top', 'right', 'La página se refrescará en un momento');

            setTimeout(function () {
                location.reload();
            }, 2000);
        },
        error: function (data) {
            // Código de error alert(data.status);
            // Mensaje de error alert(data.responseJSON.error);
        }
    });
}

/* FUNCIONES QUE AÑADEN FUNCIONALIDAD EXTRA */
// Cuando se da click en el botón de agregar cotización se esconde la lista de cotizaciones para proceder a crear una nueva
$('#btn-agregar-cot').click(function () {
    $(this).removeClass('d-inline').addClass('d-none');
    $('#btn-continuar-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-cancelar-cot').removeClass('d-none').addClass('d-inline');

    $('#container-analisis').removeClass('d-none').addClass('d-block');
    $('#container-cotizaciones').removeClass('d-block').addClass('d-none');
});
// Cuando se cancela el crear cotización mostrar la lista de cotizaciones
$('#btn-cancelar-cot').click(function () {
    $(this).removeClass('d-inline').addClass('d-none');
    $('#btn-continuar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-agregar-cot').removeClass('d-none').addClass('d-inline');

    $('#container-analisis').removeClass('d-block').addClass('d-none');
    $('#container-cotizaciones').removeClass('d-none').addClass('d-block');

    $("input[name='cot[]']:checked").each(function () {
        $(this).prop('checked', false);
    });
});
// Función para que el total se actualize con cada tecla que va introduciendo


function add_calc_total() {
    var pr = [];
    $("input[name='precios[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        pr.push(val);
    });
    var iva = [];
    $("input[name='ivas[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        if(val < 1){
            val = val*-1;
            $(this).val(val);
        }
        iva.push(val);
    });
    var desc = [];
    $("input[name='descuentos[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        if(val < 1){
            val = val*-1;
            $(this).val(val);
        }
        desc.push(val);
    });
    var tots = [];
    $("input[name='totales[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        var val = parseInt($(this).val());
        tots.push(val);
    });
    var sub = document.getElementById("subtotal");
    var total = document.getElementById("total");
    var envio = document.getElementById("envio");
    var precios = [];
    var i = 0;
    $("input[name='cantidades[]']").each(function () {
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
    i = 0;
    $("input[name='totales[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs del precio
        $(this).val(tots[i]);
        i = i + 1;
    });
    sub.value = subtotal;
    if (envio.value < 1) {
        envio.value = envio.value * -1;
    }
    total.value = subtotal + parseInt(envio.value);
}
