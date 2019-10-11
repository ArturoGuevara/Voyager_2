var token = csrftoken;

// boton para abrir modal de oi y actualizar
function cargar_info_oi(id) {
    $.ajax({
        url: "consultar_orden/"+id,
        dataType: 'json',
        data: {
            id:id,
            'csrfmiddlewaretoken': token
        },
        type: "POST",
        success: function (response) {
            var data = JSON.parse(response.data);
            console.log(data);
            //Información general
            $('#editar_estatus_orden').val(data.fields.estatus)
            $('#editar_fecha_muestra_orden').val(data.fields.fecha_muestreo)
            $('#editar_localidad_orden').val(data.fields.localidad)
            $('#editar_fecha_envio_orden').val(data.fields.fecha_envio)
            $('#editar_fecha_recibo_orden').val(data.fields.fechah_recibo)
            $('#editar_guia_orden').val(data.fields.guia_envio)
            $('#editar_link_orden').val(data.fields.link_resultados)
            //Observaciones
            /*$('#').val(data.fields.formato_ingreso_muestra)
            $('#').val(data.fields.idioma_reporte)
            $('#').val(data.fields.mrl)
            $('#').val(data.fields.fecha_eri)
            $('#').val(data.fields.notif_e)
            $('#').val(data.fields.fecha_lab)
            $('#').val(data.fields.fecha_ei)
            $('#').val(data.fields.envio_ti)
            $('#').val(data.fields.cliente_cr)
            //Facturacion
            $('#').val(data.fields.resp_pago)
            $('#').val(data.fields.correo)
            $('#').val(data.fields.telefono)*/
        }
    })
}

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    //Código que carga todas las variables para mandarlas al deste
    var mrl = $('#id_mrl').val();
    alert(mrl);
})