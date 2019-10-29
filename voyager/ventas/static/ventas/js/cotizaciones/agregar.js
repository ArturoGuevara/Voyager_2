// ######### USV01-01 ########

/* VARIABLES GLOBALES */
var id_cotizacion = 0;
var cantidad;
/* FUNCIONES QUE SE EJECUTAN AL CARGAR LA PÁGINA */
$(document).ready(function () {
    // Cuando se cierra el modal de bootstrap por dar click afuera, limpiar la tabla de análisis seleccionados en el resumen
    $('#agregar-cot').on('hidden.bs.modal', function () {
        $('#tabla-analisis-info').empty()
    });
    // Para actualizar el total al crear una nueva cotización
    $('#descuento').on("change", add_calc_total);
    $('#iva').on("change", add_calc_total);
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
                    $('#tabla-analisis-info').append('<tr><td>' + codigo + '</td><td>' + nombre + '</td><td><input id="res-cot-pr-' + id + '" name="precios[]" value='+precio+' hidden>$ ' + precio + '</td><td><input type="number" class="form-control" id="res-cot-an-' + id + '" data-id="' + id + '" name="cantidades[]" min=1 value=1 onchange="add_calc_total()"><div class="invalid-feedback">Por favor introduce una cantidad</div></td></tr>');
                    subtotal += parseFloat(precio);
                }
                total = subtotal;
                // Asignar valores al input de subtotal y total
                $('#subtotal').val(subtotal);
                var ivaa = $('#iva').val();
                var iva_total = parseInt(ivaa) / 100;
                var iva = iva_total * total;
                total = total + iva;
                $('#total').val(total);
            },
            error: function (data) {
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    } else {
        showNotification('top', 'right', 'Selecciona al menos un análisis para la cotización');
    }
}
// Función para guardar la nueva cotización
function crear_cotizacion() {
    var checked = [];
    var cantidades = [];
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
    // Obtenemos el token de django para el ajax
    var token = csrftoken;
    // Obtener valor de los inputs
    var cliente = $('#cliente').val();
    var subtotal = $('#subtotal').val();
    var descuento = $('#descuento').val();
    var iva = $('#iva').val();
    var total = $('#total').val();

    // Validamos que no estén vacíos los inputs
    check_is_not_empty(cliente, '#cliente');
    check_is_not_empty(subtotal, '#subtotal');
    check_is_not_empty(descuento, '#descuento');
    check_is_not_empty(iva, '#iva');
    check_is_not_empty(total, '#total');

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
            'cantidades[]': cantidades,
            'csrfmiddlewaretoken': token
        },
        type: "POST",
        success: function (response) {
            // Cerramos el modal para confirmar cotización
            $('#agregar-cot').modal('hide');

            // Damos retroalimentación de que se guardó correctamente
            showNotification('top', 'right', 'Cotización guardada correctamente');

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
    var sub = document.getElementById("subtotal");
    var total = document.getElementById("total");
    var iva = document.getElementById("iva");
    var precios = [];
    var i = 0;
    $("input[name='cantidades[]']").each(function () {
        //cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs de cantidad
        var val = $(this).val();
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
    var desc = document.getElementById("descuento");
    var d = parseInt(desc.value) / 100;
    var t = parseInt(total.value);
    var temp = t * d;
    var tot = t - temp;
    var ivaa = parseInt(iva.value) / 100;
    ivaa = tot * ivaa;
    tot = tot + ivaa;
    total.value = tot;
}
