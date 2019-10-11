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
            $('#editar_estatus_orden').val(1)
            $('#editar_fecha_muestra_orden').val(1)
            $('#editar_localidad_orden').val(1)
            $('#editar_fecha_envio_orden').val(1)
            $('#editar_fecha_recibo_orden').val(1)
            $('#editar_guia_orden').val(1)
            $('#editar_link_orden').val(1)
        }
    })
}

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    //Código que carga todas las variables para mandarlas al deste
    var mrl = $('#id_mrl').val();
    alert(mrl);
})