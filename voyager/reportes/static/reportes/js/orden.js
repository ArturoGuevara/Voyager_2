var token = csrftoken;


// boton para abrir modal de actualizar oi y carga los campos
function cargar_info_oi(id) {
    $.ajax({
        url: "consultar_orden/"+id,
        type: "POST",
        dataType: 'json',
        data: {
            'id':id,
            'csrfmiddlewaretoken': token
        },
        success: function (response) {
            var data = JSON.parse(response.data);
            data = data.fields;
            console.log(data);
            //console.log(data);
            //pestaña de información
            $('#editar_idOI').val(id);
            $('#editar_estatus').val(data.estatus);
            $('#editar_localidad').val(data.localidad);
            $('#editar_fecha_envio').val(data.fecha_envio);
            $('#editar_guia_envio').val(data.guia_envio)
            $('#editar_link_resultados').val(data.link_resultados);

            //pestaña de observaciones
            $('#editar_formato_ingreso_muestra').val(data.formato_ingreso_muestra);
            
            //hacer check a radio input del idioma
            if(data.idioma_reporte == "8809 ES"){
                $('#editar_idioma_reporteES').prop('checked', true);
                $('#editar_idioma_reporteEN').prop('checked', false);
            }else if(data.idioma_reporte == "8992 EN"){
                $('#editar_idioma_reporteES').prop('checked', false);
                $('#editar_idioma_reporteEN').prop('checked', true);
            }else{
                $('#editar_idioma_reporteES').prop('checked', false);
                $('#editar_idioma_reporteEN').prop('checked', false);
            }
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
            //Información general
            $('#editar_estatus_orden').val(data.fields.estatus)
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

    
    //Código que guarda todas las variables para mandarlas al server y actuaizar oi
    //pestaña de info
    var idOI = $('#editar_idOI').val();
    var estatus = $('#editar_estatus').val();
    var fecha_muestreo = $('#editar_fecha_muestreo').val();
    var localidad = $('#editar_localidad').val();
    var fecha_envio = $('#editar_fecha_envio').val();
    var fechah_recibo = $('#editar_fechah_recibo').val();
    var guia_envio = $('#editar_guia_envio').val()
    var link_resultados = $('#editar_link_resultados').val();

    //pestaña de observaciones
    var formato_ingreso_muestra = $('#editar_formato_ingreso_muestra').val();

    //checar radio seleccionado, si ninguno, se toma default español
    var idioma_reporte;
    if($('#editar_idioma_reporteES').prop('checked', true)){
        idioma_reporte = "8809 ES";
    }else if ($('#editar_idioma_reporteEN').prop('checked', true)){
        idioma_reporte = "8992 EN";
    }else{
        idioma_reporte = "8809 ES";
    }
    
    var mrl = $('#editar_mrl').val();
    var fecha_eri = $('#editar_fecha_eri').val();
    var fecha_lab = $('#editar_fecha_lab').val();
    var fecha_ei = $('#editar_fecha_ei').val();

    //Recuperar value de las checkboxes
    var notif_e = "No"
    if( $('#editar_notif_e').is(":checked") ){
        notif_e = "Sí"
    }
    var envio_ti = "No"
    if( $('#editar_envio_ti').is(":checked") ){
        envio_ti = "Sí"
    }
    var cliente_cr = "No"
    if( $('#editar_cliente_cr').is(":checked") ){
        notif_e = "Sí"
    }
    
    
    
    //Código ajax que guarda los datos
    $.ajax({
        url: 'actualizar_orden/',
        type: "POST",
        data: {
            'idOI': idOI,
            'estatus': estatus,
            'fecha_muestreo': fecha_muestreo,
            'localidad': localidad,
            'fecha_envio': fecha_envio,
            'fechah_recibo': fechah_recibo,
            'guia_envio': guia_envio,
            'link_resultados': link_resultados,
            'formato_ingreso_muestra': formato_ingreso_muestra,
            'idioma_reporte': idioma_reporte,
            'mrl': mrl,
            'fecha_eri': fecha_eri,
            'fecha_lab': fecha_lab,
            'fecha_ei': fecha_ei,
            'notif_e': notif_e,
            'envio_ti': envio_ti,
            'cliente_cr': cliente_cr,
            'csrfmiddlewaretoken': token,
        },
        dataType: 'json',
        success: function (response) {
            var data = JSON.parse(response.data);
            data = data.fields;
            console.log(data);
            var tr = '#oi-'+idOI + " .oi_estatus";
            $(tr).text(data.estatus);
        }
    });


function actualizar_tabla(oi){

}


})