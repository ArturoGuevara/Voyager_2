// boton para abrir modal de oi y actualizar
$('.oi_info_actualizar3').on('click', function () {
    var id = $(this).attr('id')
    $.ajax({
        type: "POST",
        url: "busqueda2/" + id,
        data: {
            'id': id,
            'csrfmiddlewaretoken': "{{ csrf_token }}"
        },
        success: function (data) {
            $('#receive_form').html(data);

            $('#modal-orden-interna').modal('show');
        }
    })
})
// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    //Código que carga todas las variables para mandarlas al deste
    var mrl = $('#id_mrl').val();
    alert(mrl);
})