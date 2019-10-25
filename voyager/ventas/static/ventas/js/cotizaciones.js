/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se da click en el botón de editar esconder bloque de info y mostrar el de inputs
    $('#btn-agregar-cot').click(function(){
        $(this).removeClass('d-inline').addClass('d-none');
        $('#btn-continuar-cot').removeClass('d-none').addClass('d-inline');
        $('#btn-cancelar-cot').removeClass('d-none').addClass('d-inline');

        $('#container-analisis').removeClass('d-none').addClass('d-block');
        $('#container-cotizaciones').removeClass('d-block').addClass('d-none');
    });
    // Cuando se cancela el crear cotización
    $('#btn-cancelar-cot').click(function(){
        $(this).removeClass('d-inline').addClass('d-none');
        $('#btn-continuar-cot').removeClass('d-inline').addClass('d-none');
        $('#btn-agregar-cot').removeClass('d-none').addClass('d-inline');

        $('#container-analisis').removeClass('d-block').addClass('d-none');
        $('#container-cotizaciones').removeClass('d-none').addClass('d-block');

        $("input[name='cot[]']:checked").each(function (){
            $(this).prop('checked', false);
        });
    });

    // Cuando se cierra el modal de bootstrap por dar click afuera, limpiar la tabla de análisis seleccionados en el resumen
    $('#agregar-cot').on('hidden.bs.modal', function () {
        $('#tabla-analisis-info').empty()
    });

    $('#descuento').on("change", calc_total);
    $('#iva').on("change", calc_total);
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
                    var id = data[i].pk;
                    var codigo = data[i].fields.codigo;
                    var nombre = data[i].fields.nombre;
                    var precio = data[i].fields.precio;
                    $('#tabla-analisis-info').append('<tr><td>'+codigo+'</td><td>'+nombre+'</td><td>$ '+precio+'</td><td><input type="number" class="form-control" id="res-cot-an-'+id+'" data-id="'+id+'" name="cantidades[]"><div class="invalid-feedback">Por favor introduce una cantidad</div></td></tr>');
                    subtotal+= parseFloat(precio);
                }
                total = subtotal;
                // Asignar valores al input de subtotal y total
                $('#subtotal').val(subtotal);
                var ivaa = $('#iva').val();
                var iva_total = parseInt(ivaa)/100;
                var iva = iva_total * total;
                total = total + iva;
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
    var cantidades = [];
    // Obtenemos las id de los análisis seleccionados
    $("input[name='cot[]']:checked").each(function (){
        checked.push(parseInt($(this).val()));
    });
    // Obtenemos las cantidades de los análisis seleccionados
    $("input[name='cantidades[]']").each(function (){
        cantidades.push(parseInt($(this).val()));
        // Checamos que no estén vacíos los inputs de cantidad
        var id = $(this).data('id');
        check_is_not_empty($(this).val(), "#res-cot-an-"+id+"");
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
        success: function(response){
            // Cerramos el modal para confirmar cotización
            $('#agregar-cot').modal('hide');

            // Damos retroalimentación de que se guardó correctamente
            showNotification('top','right','Cotización guardada correctamente');

            setTimeout(function(){
                location.reload();
            }, 2000);
        },
        error: function(data){
            // Código de error alert(data.status);
            // Mensaje de error alert(data.responseJSON.error);
        }
    });
}

// Función para que el total se actualize con cada tecla que va introduciendo
function calc_total(e){
    var sub = document.getElementById("subtotal");
    var total = document.getElementById("total");
    var iva = document.getElementById("iva");
    total.value = sub.value;
    var desc = document.getElementById("descuento");
    var d = parseInt(desc.value)/100;
    var t = parseInt(total.value);
    var temp = t*d;
    var tot = t - temp;
    var ivaa = parseInt(iva.value)/100;
    ivaa = tot * ivaa;
    tot = tot + ivaa;
    total.value = tot;
}


// ######### MODEL USV04-04 ########

function visualizar_cotizacion(id){
    // Verificar que el analisis existe
    if (id > 0){
        // Obtenemos el token de django para el ajax y el id guardada previamente al cargar el modal
        var token = csrftoken;
        $.ajax({
            url: "visualizar_cotizacion/"+id,
            dataType: 'json',
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(response){
                console.log(response.error)

                if (response.error == "La cotización no contiene analisis"){
                    error_datos_cotizacion();
                } else{
                    var data_cotizacion = JSON.parse(response.info[0]);
                    var data_cliente = JSON.parse(response.info[1]);
                    var data_vendedor = JSON.parse(response.info[2]);
                    var aux_analisis = response.info[3]
                    var aux_analisis_cotizacion = response.info[4];

                    analisis = []
                    for(registro in aux_analisis){
                        n_analisis = JSON.parse(aux_analisis[registro]);
                        analisis.push(n_analisis);
                    }
                    analisis_cotizacion = []
                    for(registro in aux_analisis_cotizacion){
                        n_analisis_cotizacion = JSON.parse(aux_analisis_cotizacion[registro]);
                        analisis_cotizacion.push(n_analisis_cotizacion);
                    }


                    cargar_datos_cotizacion(data_cotizacion,data_cliente,data_vendedor,analisis,analisis_cotizacion)
                }

            }
        })
    }
}

function cargar_datos_cotizacion(data_cotizacion,data_cliente,data_vendedor,analisis,analisis_cotizacion){
    $('.analisis_registro').remove();
    $('#ver_id_cot').html(data_cotizacion[0].pk);
    $('#fecha').html(data_cotizacion[0].fields.fecha_creada);
    $('#cliente_nombre').html(data_cliente[0].fields.nombre +' '+data_cliente[0].fields.apellido_paterno +' '+ data_cliente[0].fields.apellido_materno);
    $('#vendedor').html(data_vendedor[0].fields.nombre +' '+data_vendedor[0].fields.apellido_paterno +' '+ data_vendedor[0].fields.apellido_materno);
    $('#n_subtotal').html(data_cotizacion[0].fields.subtotal);
    $('#n_iva').html(data_cotizacion[0].fields.iva);
    $('#n_descuento').html(data_cotizacion[0].fields.descuento);
    $('#n_total').html(data_cotizacion[0].fields.total);
    for (n in analisis){
        $('#analisis_tabla').append("<tr class='analisis_registro'><td>"+analisis[n][0].fields.codigo+"</td><td>"+analisis[n][0].fields.nombre+"</td><td>"+analisis_cotizacion[n][0].fields.cantidad+"</td><td>$ "+analisis[n][0].fields.precio+"</td></tr>");
    }
}

function error_datos_cotizacion(){
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

//######### MODEL USV04-04 ########
