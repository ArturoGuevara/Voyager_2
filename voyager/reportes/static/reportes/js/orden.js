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

// boton dentro de forma oi que guarda
$('#submitForm').on('click', function () {
    $('#actualizar_oi').modal('toggle');
});

// boton para abrir modal de actualizar oi y carga los campos

function cargar_info_oi(){
    $.ajax({
        url: "consultar_orden/",
        type: "POST",
        dataType: 'json',
        data: {
            'id':id_oi,
            'csrfmiddlewaretoken': token
        },
        success: function (response) {
            //Datos de orden interna
            var data = JSON.parse(response.data);
            data = data.fields;
            //datos de las muestras
            if(response.muestras != null){
                var muestras = JSON.parse(response.muestras);
            }
            //datos del usuario
            if(response.usuario != null){
                var usuario = JSON.parse(response.usuario);
                usuario = usuario.fields;
            }
            //datos del solicitante
            if(response.solicitante != null){
                var solicitante = JSON.parse(response.solicitante);
                solicitante = solicitante.fields;
            }
            var analisis_muestras = response.dict_am;
            var facturas = response.facturas;
            $('#editar_usuario_empresa').text(response.s_empresa);
            var n = solicitante.nombre + " " + solicitante.apellido_paterno + " " + solicitante.apellido_materno;
            $('#editar_usuario_nombre').text(n);
            $('#editar_usuario_email').text(response.s_correo);
            $('#editar_usuario_telefono').text(solicitante.telefono);
            //pestaña de información
            $('#tituloe_idOI').text("Orden Interna #" + id_oi);
            $('#editar_idOI').val(id_oi);
            $('#editar_estatus').val(data.estatus);
            $('#editar_localidad').val(data.localidad);
            $('#editar_fecha_envio').val(data.fecha_envio);
            $('#editar_guia_envio').val(data.guia_envio)
            $('#editar_pagado').val(data.pagado)
            $('#editar_link_resultados').val(data.link_resultados);
            //pestaña de observaciones
            //hacer check a radio input del idioma
            if(data.idioma_reporte == "Español"){
                $('#editar_idioma_reporteES').prop('checked', true);
                $('#editar_idioma_reporteEN').prop('checked', false);
            }else if(data.idioma_reporte == "Inglés"){
                $('#editar_idioma_reporteES').prop('checked', false);
                $('#editar_idioma_reporteEN').prop('checked', true);
            }else{
                $('#editar_idioma_reporteES').prop('checked', false);
                $('#editar_idioma_reporteEN').prop('checked', false);
            }
            var html_muestras = "";
            if(muestras != null){
                for (let mue in muestras){
                    var id_muestra = muestras[mue].pk;
                    var objm = muestras[mue].fields;

                    html_muestras+= editar_muestras(id_muestra, objm,analisis_muestras[id_muestra], facturas[id_muestra]);
                }
            }
            $('.edicion_muestras').html(html_muestras);

            //facturación

        }
    })
}



function guardar_muestra(id_muestra){
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
    var pagado = $('#editar_pagado').val();

    //pestaña de observaciones
    var formato_ingreso_muestra = $('#editar_formato_ingreso_muestra').val();

    //checar radio seleccionado, si ninguno, se toma default español
    var idioma_reporte;
    if (document.getElementById("editar_idioma_reporteES").checked){
        idioma_reporte = "Español";
    }
    else if (document.getElementById("editar_idioma_reporteEN").checked){
        idioma_reporte = "Inglés";
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
            'pagado': pagado,
            'csrfmiddlewaretoken': token,
        },
        dataType: 'json',
        success: function (response) {
            var data = JSON.parse(response.data);
            var fecha_formato = response.fecha_formato;
            data = data.fields;
            var track = '#oi-' + idOI + " .oi_estatus";
            $(track).text(data.estatus);
            track = '#oi-' + idOI + " .oi_pagado";
            $(track).text(data.pagado);
            track = '#oi-' + idOI + " .oi_fecha_envio";
            $(track).text(fecha_formato);
            $('#modal-visualizar-orden').modal('hide');
            showNotification('top','right','Se han guardado tus cambios');
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
    //Eliminar el formato de fecha dado por Django para poder leerla
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
            <a class="card-link" data-toggle="collapse" href="#editar_collapse` + id_muestra + `">
                Muestra ` + id_muestra + `
            </a>
        </div>
        <div id="editar_collapse` + id_muestra + `" class="collapse" data-parent="#edicion">
            <div class="card-body">
                <div class="form-row">
                    <div class="form-group col-md-2">
                        <label for="editar_muestra_numero_` + id_muestra + `">Número</label>
                        <input type="text" class="form-control" id="editar_muestra_numero_` + id_muestra + `" placeholder="Número" value="` + id_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="editar_muestra_codigo_` + id_muestra + `">Código</label>
                        <input type="text" class="form-control" id="editar_muestra_codigo_` + id_muestra + `" placeholder="Código" value="` + muestra.codigo_muestra + `" disabled>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="editar_muestra_` + id_muestra + `">Muestra</label>
                        <input type="text" class="form-control" id="editar_muestra_` + id_muestra + `" placeholder="Muestra" value="` + muestra.producto + `" disabled>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="editar_muestra_numero_interno_` + id_muestra + `">Número interno</label>
                        <input type="text" class="form-control" id="editar_muestra_numero_interno_` + id_muestra + `" placeholder="Número interno" value=" ` + muestra.num_interno_informe + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="editar_muestra_fecha_recibo_` + id_muestra + `">Fecha de recibo</label>
                        <input type="text" class="form-control" id="editar_muestra_fecha_recibo_` + id_muestra + `" placeholder="2019-01-25 18:36:00" value="` + fecha_r + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="editar_muestra_orden_compra_` + id_muestra + `">Orden de compra</label>
                        <input type="text" class="form-control" id="editar_muestra_orden_compra_` + id_muestra + `" placeholder="Orden de compra" value="` + muestra.orden_compra + `">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="editar_muestra_factura_` + id_muestra + `">Factura</label>
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
    id_oi = id;
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
            console.log(response);
            data = data.fields;
            //datos de las muestras
            var muestras = JSON.parse(response.muestras);
            //datos del usuario
            var usuario = JSON.parse(response.usuario);
            usuario = usuario.fields;
            //datos del solicitante
            if(response.solicitante != null){
                var solicitante = JSON.parse(response.solicitante);
                solicitante = solicitante.fields;
            }
            var analisis_muestras = response.dict_am;
            var facturas = response.facturas;
            //pestaña de información
            $('#titulov_idOI').text("Orden Interna #" + id);
            $('#visualizar_idOI').val(id);
            $('#visualizar_estatus').val(data.estatus);
            $('#visualizar_localidad').val(data.localidad);
            $('#visualizar_fecha_envio').val(data.fecha_envio);
            $('#visualizar_guia_envio').val(data.guia_envio);
            $('#visualizar_pagado').val(data.pagado);
            $('#visualizar_link_resultados').val(data.link_resultados);
            $('#visualizar_usuario_empresa').text(response.s_empresa);
            var n = solicitante.nombre + " " + solicitante.apellido_paterno + " " + solicitante.apellido_materno;
            $('#visualizar_usuario_nombre').text(n);
            $('#visualizar_usuario_email').text(response.s_correo);
            $('#visualizar_usuario_telefono').text(solicitante.telefono);

            //pestaña de observaciones
            $('#visualizar_idioma_reporte').text(data.idioma_reporte);

            var html_muestras = "";
            if(muestras != null){
                for (let mue in muestras){
                    var id_muestra = muestras[mue].pk;
                    var objm = muestras[mue].fields;

                    html_muestras+= build_muestras(id_muestra, objm,analisis_muestras[id_muestra], facturas[id_muestra]);
                }
            }
            $('.accordion_muestras').html(html_muestras);

            /*var html_facturas =`
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
            `;*/
            //Construir tabla de facturas
            $('#f_responsable').html(response.correo_responsable);
            $('#f_correo').html(response.correo_responsable);
            $('#f_telefono').html(response.telefono);
            $('#f_empresa').html(response.empresa);


            //$('#visualizar_tabla_facturas').html(html_facturas);

        }
    })
}



$(document).ready(function(){
    // Cuando se cierra el modal para confirmar el borrado de la OI, reajusta la variable global a 0
    $('#borrar_orden').on('hidden.bs.modal', function () {
       id_oi = 0;
    });
    $('#btn-paquete-dhl').on('click', function () {
        $('#modal_paquete').modal('show');
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
                showNotification('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde.');    // Mostrar alerta de cotizacion borrada
            }
        });
    }

}

function cargar_enviar(id){
    var id_oi = id;
    var token = csrftoken;
    $.ajax({
        url: "/reportes/consultar_empresa/",
        data: {
            id: id,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            var data = JSON.parse(response.data);
            $('#email_destino').val(data.fields.correo_resultados);
        },
        error: function(data){
            $('#modal-enviar-resultados').modal('toggle');// Cerrar el modal de enviar resultados
        }
    });
}

function enviar_resultados(){
    var valid_form=true;
    if($("#archivo_resultados").val()==""){
        valid_form=false;
        $("#div-archivo").css("border-color", "red");
    }
    else{
        $("#div-archivo").css("border-color", "grey");
    }
    if(!check_is_not_empty($("#email_destino").val(),"#email_destino")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#subject").val(),"#subject")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#body").val(),"#body")){
        valid_form=false;
    }
    if(valid_form==true){
        document.getElementById("submit_resultados_form").submit();
    }
}
