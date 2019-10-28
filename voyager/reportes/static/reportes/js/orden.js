
var token = csrftoken;

//cargar datos del usuario en el modal
function cargar_info_usuario(id){
    $.ajax({

    })
}


// boton para abrir modal de actualizar oi y carga los campos
function cargar_info_oi(id) {
    $.ajax({
        url: "consultar_orden/",
        type: "POST",
        dataType: 'json',
        data: {
            'id':id,
            'csrfmiddlewaretoken': token
        },
        success: function (response) {
            var data = JSON.parse(response.data);
            data = data.fields;

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

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {

    
    //Código que guarda todas las variables para mandarlas al server y actuaizar oi
    //pestaña de info
    var idOI = $('#editar_idOI').val();
    var estatus = $('#editar_estatus').val();
    var localidad = $('#editar_localidad').val();
    var fecha_envio = $('#editar_fecha_envio').val();
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
            'localidad': localidad,
            'fecha_envio': fecha_envio,
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
            var tr = '#oi-'+idOI + " .oi_estatus";
            $(tr).text(data.estatus);
        }
    });

})

function build_muestras(id_muestra, muestra, analisis, factura){
    var html = `
    <div class="card">
        <div class="card-header">
            <a class="card-link" data-toggle="collapse" href="#collapse` + id_muestra + `">
                Muestra ` + id_muestra + `
            </a>
        </div>
        <div id="collapse` + id_muestra + `" class="collapse" data-parent="#accordion">
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group col-md-2">
                        <label for="visualizar_muestra_numero_` + id_muestra + `">Número</label>
                        <input type="text" class="form-control" id="visualizar_muestra_numero_` + id_muestra + `" placeholder="Número" value="` + id_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_codigo_` + id_muestra + `">Código</label>
                        <input type="text" class="form-control" id="visualizar_muestra_codigo_` + id_muestra + `" placeholder="Código" value="` + muestra.codigo_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="visualizar_muestra_` + id_muestra + `">Muestra</label>
                        <input type="text" class="form-control" id="visualizar_muestra_` + id_muestra + `" placeholder="Muestra" value="` + muestra.producto + `" disabled>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_numero_interno_` + id_muestra + `">Número interno</label>
                        <input type="text" class="form-control" id="visualizar_muestra_numero_interno_` + id_muestra + `" placeholder="Número interno"  disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_fecha_recibo_` + id_muestra + `">Fecha de recibo</label>
                        <input type="date" class="form-control" id="visualizar_muestra_fecha_recibo_` + id_muestra + `" value="` + muestra.fechah_recibo + `" disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_orden_compra_` + id_muestra + `">Orden de compra</label>
                        <input type="text" class="form-control" id="visualizar_muestra_orden_compra_` + id_muestra + `" placeholder="Orden de compra" value="` + muestra.orden_compra + `" disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_factura_` + id_muestra + `">Factura</label>
                        <input type="text" class="form-control" id="visualizar_muestra_factura_` + id_muestra + `" placeholder="Factura" value="` + factura + `" disabled>
                    </div>
                </div>
                <p>Análisis</p>
                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <th>Nombre</th>
                        </thead>
                        <tbody>`;


    for(let a in analisis){
        html = html+ `
            <tr>
                <td>`+ analisis[a] +`</td>
            </tr>
        `;
    }

    html = html+ `</tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

// boton para abrir modal de visualizar oi y carga los campos
function visualizar_info_oi(id) {
    $.ajax({
        url: "consultar_orden/",
        type: "POST",
        dataType: 'json',
        data: {
            'id':id,
            'csrfmiddlewaretoken': token
        },
        success: function (response) {
            //datos de la orden interna
            var data = JSON.parse(response.data);
            data = data.fields;
            //datos de las muestras
            var muestras = JSON.parse(response.muestras);
            //datos del usuario
            var usuario = JSON.parse(response.usuario);
            usuario = usuario.fields;
            var correo = response.correo;
            var analisis_muestras = response.dict_am;
            var facturas = response.facturas;

            //pestaña de información
            $('#visualizar_idOI').val(id);
            $('#visualizar_estatus').val(data.estatus);
            $('#visualizar_localidad').val(data.localidad);
            $('#visualizar_fecha_envio').val(data.fecha_envio);
            $('#visualizar_guia_envio').val(data.guia_envio)
            $('#visualizar_link_resultados').val(data.link_resultados);
            $('#visualizar_usuario_empresa').text(response.empresa);
            var n = usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno;
            $('#visualizar_usuario_nombre').text(n);            
            $('#visualizar_usuario_email').text(response.correo);
            $('#visualizar_usuario_telefono').text(usuario.telefono);

            //pestaña de observaciones
            $('#visualizar_formato_ingreso_muestra').val(data.formato_ingreso_muestra);
            //hacer check a radio input del idioma
            $('#visualizar_idioma_reporte').text(data.idioma_reporte);
            $('#visualizar_mrl').val(data.mrl);
            $('#visualizar_fecha_eri').val(data.fecha_eri);
            $('#visualizar_fecha_lab').val(data.fecha_lab);
            $('#visualizar_fecha_ei').val(data.fecha_ei);
            $('#visualizar_notif_e').text(data.notif_e)
            $('#visualizar_envio_ti').text(data.envio_ti);
            $('#visualizar_cliente_cr').text(data.cliente_cr);

            var html_muestras = "";

            for (let mue in muestras){
                var id_muestra = muestras[mue].pk;
                var objm = muestras[mue].fields;

                html_muestras+= build_muestras(id_muestra, objm,analisis_muestras[id_muestra], facturas[id_muestra]);
            }
            $('.accordion_muestras').html(html_muestras);

            //Construir tabla de facturas
            var html_facturas =`
            <table class="table table-hover table-striped">
                <thead>
                    <th>Nombre</th>
                </thead>
                <tbody>`;
            for(let fact in facturas){
                html_facturas = html_facturas+ `
                    <tr>
                        <td>`+ facturas[fact] +`</td>
                    </tr>
                `;
            }
            html_facturas = html_facturas+ `
                    </tbody>
                </table>
            `;
            $('#visualizar_tabla_facturas').html(html_facturas);
            
        }
    })
}