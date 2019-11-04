var token = csrftoken;


// Función que crea y muestra alerta
function showNotification(from, align, msg){
    color = Math.floor((Math.random() * 4) + 1);
	$.notify({
		icon: "nc-icon nc-app",
		message: msg
	},{
		timer: 4000,
		placement: {
			from: from,
			align: align
		}
	});
}


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
            var data = JSON.parse(response.datos);

            if(response.datos_ordenes != ""){
                var ordenes = JSON.parse(response.datos_ordenes);
            }
            var rol = response.rol;
            data = data.fields;

            if(rol == "Cliente"){
                
                $('#ordenes_pendientes').removeClass('d-none');

                $('#tabla_cont').empty();
                for(var i = 0; i < ordenes.length; i++){
                    var id = ordenes[i].pk;
                    var estatus = ordenes[i].fields.estatus;

                    $('#tabla_usuario').append('<tr><th scope="row">'+ id +'</th><td>'+ estatus +'</td></tr>');
                }
            }else{
                $('#ordenes_pendientes').addClass('d-none');
                $('#tabla_cont').empty();
            }
            //pestaña de información
            $('#input_nombre').val(data.nombre);
            $('#id_usuario').val(data.user);
            if (data.estatus_pago == "NA"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA" selected>NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor">Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado">Pagado</option>');
            }else if (data.estatus_pago == "Deudor"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA">NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor" selected>Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado">Pagado</option>');
            }else if (data.estatus_pago == "Pagado"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA">NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor">Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado" selected>Pagado</option>');
            }
        }
    })
}

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    $('#actualizar_usuario').modal('toggle');
});

function submit(){
    var estatus = "";
    if ($('#inputEstatus').val() == "NA" || $('#inputEstatus').val() == "Deudor" || $('#inputEstatus').val() == "Pagado"){
        estatus = $('#inputEstatus').val();
    }
    var id = $('#id_usuario').val();
    //Código ajax que guarda los datos
    $.ajax({
        url: 'actualizar_usuario/',
        type: "POST",
        data: {
            'id': id,
            'estatus': estatus,
            'csrfmiddlewaretoken': token,
        },
        dataType: 'json',
        success: function (response) {
            var data = JSON.parse(response.datos);
            data = data.fields;
            var tr = '#usuario-'+id + " .u_estatus";
            $(tr).text(data.estatus_pago);
            showNotification('top','right','Se han guardado tus cambios');
            $('#actualizar_usuario').modal('toggle');
            $('#modal_info_usuario').modal('toggle');
        }
    });
}