var token = csrftoken;
var id_usuario = 0;


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
        url: "/cuentas/consultar_usuario/"+id,
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
            $('#nombre').text(data.nombre);
            $('#apellido_paterno').text(data.apellido_paterno);
            $('#apellido_materno').text(data.apellido_materno);
            $('#telefono').text(data.telefono);
            $('#correo').text(response.mail);
            $('#empresa').text(response.nombre_empresa);
            $('#id_usuario').val(data.user);
            $('#estatus').text(data.estatus_pago);
            if (data.estatus_pago == "NA"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA" selected>NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor">Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado">Pagado</option>');
                $('#inputEstatus').append('<option id="Bloqueado" name="Bloqueado">Bloqueado</option>');
            }else if (data.estatus_pago == "Deudor"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA">NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor" selected>Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado">Pagado</option>');
                $('#inputEstatus').append('<option id="Bloqueado" name="Bloqueado">Bloqueado</option>');
            }else if (data.estatus_pago == "Pagado"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA">NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor">Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado" selected>Pagado</option>');
                $('#inputEstatus').append('<option id="Bloqueado" name="Bloqueado">Bloqueado</option>');
            }else if (data.estatus_pago == "Bloqueado"){
                $('#inputEstatus').empty();
                $('#inputEstatus').append('<option id="NA" name="NA">NA</option>');
                $('#inputEstatus').append('<option id="Deudor" name="Deudor">Deudor</option>');
                $('#inputEstatus').append('<option id="Pagado" name="Pagado">Pagado</option>');
                $('#inputEstatus').append('<option id="Bloqueado" name="Bloqueado" selected>Bloqueado</option>');
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
    if ($('#inputEstatus').val() == "NA" || $('#inputEstatus').val() == "Deudor" || $('#inputEstatus').val() == "Pagado" || $('#inputEstatus').val() == "Bloqueado"){
        estatus = $('#inputEstatus').val();
    }else{
        showNotificationDanger('top','right','Por favor, seleccione un estatus válido');
        return false; //Detiene la función por si el estatus ingresado es inválido
    }
    var id = $('#id_usuario').val();
    //Código ajax que guarda los datos
    $.ajax({
        url: '/cuentas/actualizar_usuario/',
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
            showNotificationSuccess('top','right','Se han guardado tus cambios');
            $('#actualizar_usuario').modal('toggle');
            $('#modal_info_usuario').modal('toggle');
        }
    });
}
