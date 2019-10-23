var token = csrftoken;

// boton para abrir modal de actualizar oi y carga los campos
function cargar_info_usuario(id) {
    $.ajax({
        url: "consultar_usuario/"+id,
        type: "POST",
        dataType: 'json',
        data: {
            'id':id,
            'csrfmiddlewaretoken': token
        },
        success: function (response) {

            var data = JSON.parse(response.data);
            var ordenes = JSON.parse(response.data_ordenes);
            data = data.fields;

            $('#tabla_cont').empty();
            for(var i = 0; i < ordenes.length; i++){
                var id = ordenes[i].pk;
                var estatus = ordenes[i].fields.estatus;

                $('#tabla_usuario').append('<tr><th scope="row">'+ id +'</th><td>'+ estatus +'</td></tr>');
            }
            //pestaña de información
            $('#input_nombre').val(data.nombre);
            
        }
    })
}