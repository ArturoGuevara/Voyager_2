var token = csrftoken;
var id_oi;  // Variable global para borrar orden interna

function validarFecha(str, id){
    var id_new = "#editar_muestra_fecha_recibo_" + String(id);
    if (moment(str, 'YYYY-MM-DD HH:mm:ss',true).isValid()){
        $(id_new).removeClass('is-invalid');
        return true;
    }else{
        $(id_new).addClass('is-invalid');
        return false;
    }
}

// Función que crea y muestra alerta
function showNotification(from, align, msg){
    color = Math.floor((Math.random() * 4) + 1);
	$.notify({
		icon: "nc-icon nc-app",
        message: msg,
	},{
		timer: 4000,
		placement: {
			from: from,
			align: align
		}
	});
}

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    $('#actualizar_oi').modal('toggle');
});

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
            //Datos de orden interna
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
            if(data.notif_e == "Sí"){
                document.getElementById("editar_notif_e").checked = true;
            }
            else{
                document.getElementById("editar_notif_e").checked = false;
            }
            if(data.envio_ti == "Sí"){
                document.getElementById("editar_envio_ti").checked = true;
            }
            else{
                document.getElementById("editar_envio_ti").checked = false;
            }
            if(data.cliente_cr == "Sí"){
                document.getElementById("editar_cliente_cr").checked = true;
            }
            else{
                document.getElementById("editar_cliente_cr").checked = false;
            }

            var html_muestras = "";

            for (let mue in muestras){
                var id_muestra = muestras[mue].pk;
                var objm = muestras[mue].fields;

                html_muestras+= editar_muestras(id_muestra, objm,analisis_muestras[id_muestra], facturas[id_muestra]);
            }
            $('.edicion_muestras').html(html_muestras);
        }
    })
}

function guardar_muestra(id_muestra){
    //var idOI = $('#editar_idOI').val();
    var ni = "#editar_muestra_numero_interno_" + id_muestra;
    num_interno = $(ni).val();
    var fr = "#editar_muestra_fecha_recibo_" + id_muestra;
    fechah_recibo = $(fr).val();
    var oc = "#editar_muestra_orden_compra_" + id_muestra;
    orden_compra = $(oc).val();
    var f = "#editar_muestra_factura_" + id_muestra;
    factura = $(f).val();
    if (validarFecha(fechah_recibo, id_muestra)){
        //Código ajax que guarda una muestra en particular
        $.ajax({
            url: 'actualizar_muestra/',
            type: "POST",
            data: {
                'id_muestra': id_muestra,
                'fechah_recibo': fechah_recibo,
                'orden_compra': orden_compra,
                'num_interno_informe': num_interno,
                'factura': factura,
                'csrfmiddlewaretoken': token,
            },
            dataType: 'json',
            success: function (response) {
                showNotification('top','right','La muestra se ha guardado correctamente');
            },
            error: function () {
                showNotification('top','right','Ha ocurrido un error, por favor revisa tus datos');
            },
        });
    }
}

// boton dentro de forma oi que guarda
function submit(){

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
    if (document.getElementById("editar_idioma_reporteES").checked){
        idioma_reporte = "8809 ES";
    }
    else if (document.getElementById("editar_idioma_reporteEN").checked){
        idioma_reporte = "8992 EN";
    }

    var mrl = $('#editar_mrl').val();
    var fecha_eri = $('#editar_fecha_eri').val();
    var fecha_lab = $('#editar_fecha_lab').val();
    var fecha_ei = $('#editar_fecha_ei').val();

    //Recuperar value de las checkboxes
    var notif_e = "No"
    if (document.getElementById("editar_notif_e").checked){
        notif_e = "Sí"
    }
    var envio_ti = "No"
    if (document.getElementById("editar_envio_ti").checked){
        envio_ti = "Sí"
    }
    var cliente_cr = "No"
    if (document.getElementById("editar_cliente_cr").checked){
        cliente_cr = "Sí"
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
            tr = '#oi-'+idOI + " .oi_localidad";
            $(tr).text(data.localidad);
            showNotification('top','right','Se han guardado tus cambios');
            $('#actualizar_oi').modal('toggle');
            $('#modal-orden-interna').modal('toggle');
        }
    });
}

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

function editar_muestras(id_muestra, muestra, analisis, factura){
    if (muestra.fechah_recibo != null){
        fecha_r = muestra.fechah_recibo.replace('T', ' ');
        fecha_r = fecha_r.replace('Z', '');
    }
    else{
        fecha_r = '';
    }
    var html = `
    <div class="card">
        <div class="card-header">
            <a class="card-link" data-toggle="collapse" href="#collapse` + id_muestra + `">
                Muestra ` + id_muestra + `
            </a>
        </div>
        <div id="collapse` + id_muestra + `" class="collapse" data-parent="#edicion">
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group col-md-2">
                        <label for="visualizar_muestra_numero_` + id_muestra + `">Número</label>
                        <input type="text" class="form-control" id="editar_muestra_numero_` + id_muestra + `" placeholder="Número" value="` + id_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_codigo_` + id_muestra + `">Código</label>
                        <input type="text" class="form-control" id="editar_muestra_codigo_` + id_muestra + `" placeholder="Código" value="` + muestra.codigo_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="visualizar_muestra_` + id_muestra + `">Muestra</label>
                        <input type="text" class="form-control" id="editar_muestra_` + id_muestra + `" placeholder="Muestra" value="` + muestra.producto + `" disabled>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_numero_interno_` + id_muestra + `">Número interno</label>
                        <input type="text" class="form-control" id="editar_muestra_numero_interno_` + id_muestra + `" placeholder="Número interno" value=" ` + muestra.num_interno_informe + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_fecha_recibo_` + id_muestra + `">Fecha de recibo</label>
                        <input type="text" class="form-control" id="editar_muestra_fecha_recibo_` + id_muestra + `" placeholder="2019-01-25 18:36:00" value="` + fecha_r + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_orden_compra_` + id_muestra + `">Orden de compra</label>
                        <input type="text" class="form-control" id="editar_muestra_orden_compra_` + id_muestra + `" placeholder="Orden de compra" value="` + muestra.orden_compra + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="visualizar_muestra_factura_` + id_muestra + `">Factura</label>
                        <input type="number" class="form-control" id="editar_muestra_factura_` + id_muestra + `" placeholder="Factura" value="` + factura + `">
                    </div>
                    <input class="btn btn-success ml-3 ml-auto" type="button" onclick="guardar_muestra(` + id_muestra + `)" value="Guardar" />
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

$(document).ready(function(){
    // Cuando se cierra el modal para confirmar el borrado de la OI, reajusta la variable global a 0
    $('#borrar_orden').on('hidden.bs.modal', function () {
       id_oi = 0;
    });
})

// Cargar id de OI a variable global
function borrar_oi(id){
    if (id > 0){
        id_oi = id;
    }
}

function confirmar_borrar_oi(){
    if (id_oi > 0){
        var id = id_oi;
        var token = csrftoken;
        $.ajax({
            url: "borrar_orden/",
            // Infor que se enviara al controlador
            data: {
                id: id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                $('#oi-'+id).remove();
                $('#borrar_orden').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
                showNotification('top','right','Se ha borrado la Orden Interna exitosamente.');    // Mostrar alerta de cotizacion borrada
            },
            error: function(data){
                $('#borrar_orden').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
                showNotification('top','right','Ah ocurrido un error, inténtelo de nuevo más tarde.');    // Mostrar alerta de cotizacion borrada
            }
        });
    }

}
