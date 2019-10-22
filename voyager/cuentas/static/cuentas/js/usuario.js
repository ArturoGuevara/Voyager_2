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
            //ordenes = ordenes.fields;
            //console.log(ordenes);

            $('#tabla_cont').empty();
            console.log(data);
            for(var i = 0; i < ordenes.length; i++){
                var id = ordenes[i].pk;
                var estatus = ordenes[i].fields.estatus;

                $('#tabla_usuario').append('<tr><th scope="row">'+ id +'</th><td>'+ estatus +'</td></tr>');
            }
            //pestaña de información
            $('#input_nombre').val(data.nombre);
            /*$('#editar_estatus').val(data.estatus);
            $('#editar_localidad').val(data.localidad);
            $('#editar_fecha_envio').val(data.fecha_envio);
            $('#editar_guia_envio').val(data.guia_envio)
            $('#editar_link_resultados').val(data.link_resultados);
            //pestaña de observaciones
            $('#editar_formato_ingreso_muestra').val(data.formato_ingreso_muestra);
            
            
            $('#editar_mrl').val(data.mrl);
            $('#editar_fecha_eri').val(data.fecha_eri);
            $('#editar_fecha_lab').val(data.fecha_lab);
            $('#editar_fecha_ei').val(data.fecha_ei);
            


            //Hacer check a las checkboxes
            if(data.notif_e ="Sí"){
                $('#editar_notif_e').prop('checked', true)
            }
            if(data.envio_ti ="Sí"){
                $('#editar_envio_ti').prop('checked', true)
            }
            if(data.cliente_cr ="Sí"){
                $('#editar_cliente_cr').prop('checked', true)
            }

/*
            //Información general
            $('#editar_estatus_orden').val(data.fields.estatus)
            $('#editar_localidad_orden').val(data.fields.localidad)
            $('#editar_fecha_envio_orden').val(data.fields.fecha_envio)
            $('#editar_guia_orden').val(data.fields.guia_envio)
            $('#editar_link_orden').val(data.fields.link_resultados)
            //Observaciones
            $('#').val(data.fields.formato_ingreso_muestra)
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
            $('#').val(data.fields.telefono)
            */
        }
    })
}