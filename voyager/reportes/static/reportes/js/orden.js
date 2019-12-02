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
            var analisis_ids = response.dict_ids;
            var facturas = response.facturas;
            var analisis = JSON.parse(response.analisis);

            $('#editar_usuario_empresa').text(response.empresa);
            var n = usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno;
            $('#editar_usuario_nombre').text(n);
            $('#editar_usuario_email').text(response.correo);
            $('#editar_usuario_telefono').text(response.telefono);
            //pestaña de información
            $('#tituloe_idOI').text("Orden Interna #" + id_oi);
            $('#editar_idOI').val(id_oi);
            $('#editar_estatus').val(data.estatus);
            $('#editar_localidad').val(data.localidad);
            $('#editar_fecha_recepcion_m').val(data.fecha_recepcion_m);
            $('#editar_fecha_envio').val(data.fecha_envio);
            $('#editar_fecha_llegada_lab').val(data.fecha_llegada_lab);
            $('#editar_pagado').val(data.pagado)
            $('#editar_link_resultados').val(data.link_resultados);
            //pestaña de observaciones
            $('#e_observaciones').val(data.observaciones);
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

                    html_muestras+= editar_muestras(id_muestra, objm,analisis_muestras[id_muestra], analisis_ids[id_muestra], facturas[id_muestra], analisis);
                }
            }
            $('#editar-body').html(html_muestras);
        }
    })
}

function guardar_muestra(id_muestra){
    var mp = "#editar_muestra_producto_" + id_muestra;
    var producto = $(mp).val();
    var muestra_mrl = "#editar_muestra_mrl_" + id_muestra;
    var mrl = $(muestra_mrl).val();
    var ni = "#editar_muestra_numero_interno_" + id_muestra;
    var num_interno = $(ni).val();
    var fei = "#editar_muestra_fecha_esperada_informe_" + id_muestra;
    var fecha_esperada = $(fei).val();
    var fri = "#editar_muestra_fecha_recibo_informe_" + id_muestra;
    var fecha_recibo = $(fri).val();
    var ml = "#editar_muestra_link_" + id_muestra;
    var link = $(ml).val();
    var mm = "#editar_muestra_muestreador_" + id_muestra;
    var muestreador = $(mm).val();
    var chocomilk = [];
    $('tr[name="editar_muestra_'+ id_muestra +'[]"]').each(function (){
        chocomilk.push($(this).find('#editar_analisis_' + id_muestra).val());
    });
    var pancho = [];
    var i = 0;
    $('tr[name="editar_muestra_'+ id_muestra +'[]"]').each(function (){
        pancho.push($(this).find('#' + chocomilk[i]).html());
        i++;
    });

    var dict = {
        1 : check_is_not_empty(producto, '#editar_muestra_producto_' + id_muestra),
        2 : check_is_not_empty(mrl, '#editar_muestra_mrl_' + id_muestra),
        3 : check_is_not_empty(muestreador, '#editar_muestra_muestreador_' + id_muestra)
    }

    var flag = true;
    for(var key in dict) {
      var value = dict[key];
      if(value == false){
          flag = false
          break;
      }
    }

    if (flag){
        //Código ajax que guarda una muestra en particular
        $.ajax({
            url: 'actualizar_muestra/',
            type: "POST",
            data: {
                'id_muestra': id_muestra,
                'producto': producto,
                'mrl': mrl,
                'num_interno': num_interno,
                'fecha_esperada': fecha_esperada,
                'fecha_recibo': fecha_recibo,
                'link': link,
                'muestreador': muestreador,
                'ids[]': chocomilk,
                'csrfmiddlewaretoken': token,
            },
            dataType: 'json',
            success: function (response) {
                showNotificationModal('top','right','La muestra se ha guardado correctamente','success');
                $('tr[name="editar_muestra_'+ id_muestra +'[]"]').each(function (){
                    $(this).find('#editar_muestra_producto_' + id_muestra).val(producto);
                    $(this).find('#editar_muestra_mrl_' + id_muestra).val(mrl);
                    $(this).find('#editar_muestra_numero_interno_' + id_muestra).val(num_interno);
                    $(this).find('#editar_muestra_fecha_esperada_informe_' + id_muestra).val(fecha_esperada);
                    if(fecha_recibo != ""){
                      $(this).find('#editar_muestra_fecha_recibo_informe_' + id_muestra).val(fecha_recibo);
                    }
                    if(link != ""){
                      $(this).find('#editar_muestra_link_' + id_muestra).val(link);
                    }
                    $(this).find('#editar_muestra_muestreador_' + id_muestra).val(muestreador);
                });
                $('tr[name="ver_muestra_'+ id_muestra +'[]"]').each(function (){
                    $(this).find('#producto_' + id_muestra).html(producto);
                    $(this).find('#mrl_' + id_muestra).html(mrl);
                    $(this).find('#num_interno_' + id_muestra).html(num_interno);
                    $(this).find('#fei_' + id_muestra).html(fecha_esperada);
                    if(fecha_recibo != ""){
                      $(this).find('#fri_' + id_muestra).html(fecha_recibo);
                    }
                    else{
                      $(this).find('#fri_' + id_muestra).html("-");
                    }
                    if(link != ""){
                      $(this).find('#link_' + id_muestra).html('<a href="'+ link +'" target=_blank>Ir a PDF</a>');
                    }
                    else{
                      $(this).find('#link_' + id_muestra).html("");
                    }
                    $(this).find('#muestreador_' + id_muestra).html(muestreador);
                });
                i = 0;
                $('tr[name="ver_muestra_'+ id_muestra +'[]"]').each(function (){
                    $(this).find('#analisis_' + id_muestra).html(pancho[i]);
                    i++;
                });
            },
            error: function () {
                showNotificationDanger('top','right','Ha ocurrido un error, por favor inténtelo de nuevo');
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
    var fecha_recepcion_m = $('#editar_fecha_recepcion_m').val();
    var fecha_llegada_lab = $('#editar_fecha_llegada_lab').val();
    var link_resultados = $('#editar_link_resultados').val();
    var pagado = $('#editar_pagado').val();

    //pestaña de observaciones
    var formato_ingreso_muestra = $('#editar_formato_ingreso_muestra').val();
    var observaciones = $('#e_observaciones').val();

    //checar radio seleccionado, si ninguno, se toma default español
    var idioma_reporte="";
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
            'fecha_recepcion_m': fecha_recepcion_m,
            'fecha_llegada_lab': fecha_llegada_lab,
            'link_resultados': link_resultados,
            'formato_ingreso_muestra': formato_ingreso_muestra,
            'idioma_reporte': idioma_reporte,
            'observaciones': observaciones,
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
            showNotificationSuccess('top','right','Se han guardado tus cambios');
        }
    });
}

function build_muestras(id_muestra, muestra, analisis, factura){
    var html = ``;
    for(let a in analisis){
        var siono = "No";
        var pdf = "";
        var fei = muestra.fecha_esperada_recibo;
        var fri = muestra.fecha_recibo_informe;
        var informe = muestra.num_interno_informe;
        var producto = muestra.producto;
        var codigo_muestra = muestra.codigo_muestra;
        if(muestra.enviado){
            siono = "Sí";
        }
        if(muestra.link_resultados != ""){
            pdf = "Ir a PDF";
        }
        if(muestra.producto == null){
            producto = "-";
        }
        if(muestra.codigo_muestra == null){
            codigo_muestra = "-";
        }
        if(muestra.fecha_esperada_recibo == null){
            fei = "-";
        }
        if(muestra.fecha_recibo_informe == null){
            fri = "-";
        }
        if(muestra.num_interno_informe == null || muestra.num_interno_informe == "null"){
            informe = "";
        }
        html = html + `
                <tr name="ver_muestra_`+ id_muestra +`[]">
                    <td id="numero_`+ id_muestra +`">` + id_muestra + `</td>
                    <td id="producto_`+ id_muestra +`">` + producto + `</td>
                    <td id="codigo_`+ id_muestra +`">` + codigo_muestra + `</td>
                    <td id="analisis_`+ id_muestra +`">`+ analisis[a] +`</td>
                    <td id="mrl_`+ id_muestra +`">` + muestra.mrl + `</td>
                    <td id="num_interno_`+ id_muestra +`">` + informe + `</td>
                    <td id="fei_`+ id_muestra +`">` + fei + `</td>
                    <td id="fri_`+ id_muestra +`">` + fri + `</td>
                    <td id="siono_`+ id_muestra +`">` + siono + `</td>
                    <td id="link_`+ id_muestra +`"><a href="resultados/` + muestra.link_resultados + `" target=_blank>` + pdf + `</a></td>
                    <td id="muestreador_`+ id_muestra +`">` + muestra.muestreador + `</td>
                </tr>
                `;
    }
    return html;
}

function editar_muestras(id_muestra, muestra, analisis, ids, factura, anal){
    var html = ``;
    var i = 0;
    for(let a in analisis){
        var siono = "No";
        if(muestra.enviado){
            siono = "Sí";
        }
        var informe = muestra.num_interno_informe;
        if(muestra.num_interno_informe == null || muestra.num_interno_informe == "null"){
            informe = "";
        }
        html = html + `

                <tr name="editar_muestra_`+ id_muestra +`[]" id=editar_`+ i +`>
                    <td><input type="text" class="form-control" id="editar_muestra_numero_` + id_muestra + `" placeholder="Número" value="` + id_muestra + `" disabled></td>
                    <td><input type="text" class="form-control" style="width: 200px;" id="editar_muestra_producto_` + id_muestra + `" placeholder="Aguacate" value="` + muestra.producto + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"><div class="invalid-feedback">Ingrese el producto</div></td>
                    <td><input type="text" class="form-control" style="width: 100px;" id="editar_muestra_codigo_` + id_muestra + `" placeholder="A12345" value="` + muestra.codigo_muestra + `" disabled></td>
                    <td><select class="form-control" style="width: 150px;" id="editar_analisis_` + id_muestra + `">
                `;
        for(let x in anal){
            if(anal[x].pk == ids[a]){
                html = html + `
                        <option id="`+ anal[x].pk +`" value="`+ anal[x].pk +`" selected>` + anal[x].fields.nombre + `</option>
                `;
            }else{
                html = html + `
                        <option id="`+ anal[x].pk +`" value="`+ anal[x].pk +`">` + anal[x].fields.nombre + `</option>
                `;
            }

        }
        html = html + `
                </select>
                </td>
                <td><input type="text" class="form-control" style="width: 100px;" id="editar_muestra_mrl_` + id_muestra + `" placeholder="NA" value="` + muestra.mrl + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"><div class="invalid-feedback">Ingrese un MRL válido o NA</div></td>
                <td><input type="text" class="form-control" style="width: 150px;" id="editar_muestra_numero_interno_` + id_muestra + `" placeholder="A1B34C" value="` + informe + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"><div class="invalid-feedback">Ingrese el número interno</div></td>
                <td><input type="date" class="form-control" id="editar_muestra_fecha_esperada_informe_` + id_muestra + `" placeholder="01-01-2019" value="` + muestra.fecha_esperada_recibo + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"><div class="invalid-feedback">Ingrese la fecha estimada</div></td>
                <td><input type="date" class="form-control" id="editar_muestra_fecha_recibo_informe_` + id_muestra + `" placeholder="01-01-2019" value="` + muestra.fecha_recibo_informe + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"></td>
                <td><input type="text" class="form-control" id="editar_muestra_resultados_enviados_` + id_muestra + `" placeholder="No" value="` + siono + `" disabled></td>
                <td><input type="text" class="form-control" style="width: 150px;" id="editar_muestra_link_` + id_muestra + `" value="` + muestra.link_resultados + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"></td>
                <td><input type="text" class="form-control" style="width: 150px;" id="editar_muestra_muestreador_` + id_muestra + `" placeholder="John Cena" value="` + muestra.muestreador + `" onchange="sincronizar(`+ id_muestra +`, this.value, this.id)"><div class="invalid-feedback">Ingrese al muestreador</div></td>
                <td><input class="btn btn-success ml-3 ml-auto" type="button" onclick="guardar_muestra(` + id_muestra + `)" value="Guardar" /></td>
            </tr>`;
          i++;
          }
      return html;
}


// boton para abrir modal de visualizar oi y carga los campos
function visualizar_info_oi(id) {
    visualizar_facturacion(id);
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
            $('#visualizar_fecha_recepcion_m').val(data.fecha_recepcion_m);
            $('#visualizar_fecha_envio').val(data.fecha_envio);
            $('#visualizar_fecha_llegada_lab').val(data.fecha_llegada_lab);
            $('#visualizar_pagado').val(data.pagado);
            $('#visualizar_link_resultados').val(data.link_resultados);
            $('#visualizar_usuario_empresa').text(response.empresa);
            var n = usuario.nombre + " " + usuario.apellido_paterno + " " + usuario.apellido_materno;
            $('#visualizar_usuario_nombre').text(n);
            $('#visualizar_usuario_email').text(response.correo);
            $('#visualizar_usuario_telefono').text(response.telefono);

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
            $('#muestras-body').html(html_muestras);
            $('#v_observaciones').val(data.observaciones);

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

    success_code_fact_check();
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
                showNotificationSuccess('top','right','Se ha borrado la Orden Interna exitosamente.');    // Mostrar alerta de cotizacion borrada
            },
            error: function(data){
                $('#borrar_orden').modal('toggle');                                        // Cerrar el modal de borrar cotizacion
                showNotificationDanger('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde.');    // Mostrar alerta de cotizacion borrada
            }
        });
    }

}

function cargar_enviar(id){
    var id_oi = id;
    var token = csrftoken;
    $.ajax({
        url: "/reportes/consultar_empresa_muestras/",
        data: {
            id: id,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            var data = JSON.parse(response.data);
            var muestras = JSON.parse(response.muestras);
            $('#email_destino').val(data[0].fields.correo_resultados);
            var html_drop = dropdown_muestras(muestras);
            $('#muestra').html(html_drop);
        },
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

function dropdown_muestras(muestras){
    var ans="";
    for(muestra in muestras){
        ans+="<option value='"+muestras[muestra].pk+"'>Muestra "+muestras[muestra].pk+"</option>"
    }
    return ans;
}

function visualizar_facturacion(id){
    $.ajax({
        url: "/reportes/visualizar_facturacion/",
        data: {
            id: id,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            var data_facturacion = JSON.parse(response.data[0]);

            var data_muestras = [];
            var data_ac = [];
            var data_analisis = [];
            // Organizar la informacion en distintos arreglos
            for (x in response.data){
                if (x != 0){
                    if (x % 3 == 1){
                        data_analisis.push(JSON.parse(response.data[x]));
                    }
                    if (x % 3 == 2){
                        data_ac.push(JSON.parse(response.data[x]));
                    }
                    if (x % 3 == 0){
                        data_muestras.push(JSON.parse(response.data[x]));
                    }
                }
            }
            llenar_tabla_analisis(data_muestras, data_ac, data_analisis);
            llenar_datos_facturacion(data_facturacion);
        },
        error: function(data){
        }
    });
}

function llenar_datos_facturacion(data_facturacion){
    data = data_facturacion[0]
    $('#responsable_pago_fact').val(data.fields.resp_pago);
    $('#correo_fact').val(data.fields.correos);
    $('#numero_fact').val(data.fields.numero_factura);
    $('#fecha_fact').val(data.fields.fecha_factura);
    $('#complemento_pago').val(data.fields.complemento_pago);
    if (data.fields.cobrar_envio == true){
        $('#cobro_envio').val("True");
    }else{
        $('#cobro_envio').val("False");
    }
    $('#oi_id_fact').val(data.fields.oi);
    if (data.fields.envio_factura == true){
        $('#envio_fact').val("True");
    }else{
        $('#envio_fact').val("False");
    }
    $('#fecha_envio_fact').val(data.fields.fecha_envio_factura);
    $('#pago_fact').val(data.fields.pago_factura);
    if (data.fields.envio_informes == true){
        $('#envio_informes').val("True");
    }else{
        $('#envio_informes').val("False");
    }
    $('#orden_compra').val(data.fields.orden_compra);
    $('#cantidad_pagada').val(data.fields.cantidad_pagada);
}

function llenar_tabla_analisis(data_muestras, data_ac, data_analisis){
    var total_muestras = []
    for(x in data_muestras){
        var precio_unit = parseFloat(data_analisis[x][0].fields.precio);
        var descuento = parseFloat(data_ac[x][0].fields.descuento);
        var iva = parseFloat(data_ac[x][0].fields.iva);
        var total_muestra_ind = precio_unit - ( (precio_unit * descuento)/100 ) + ( (precio_unit * iva)/100 )
        total_muestras.push(total_muestra_ind)
        console.log(data_muestras[x][0].fields);
        $('#oi-muestra_tabla').append('<tr class="registro-tabla-factura-oi"><td>'+data_analisis[x][0].fields.codigo+'</td><td>'+data_analisis[x][0].fields.nombre+'</td><td>'+data_analisis[x][0].fields.descripcion+'</td><td>'+validar_muestra(data_muestras[x][0].fields)+'</td><td>$ '+precio_unit+'</td><td>'+descuento+' %</td><td>'+iva+' %</td><td> $ '+ total_muestra_ind);
    }
    var subtotal_muestras = 0;
    for (i in total_muestras){
        subtotal_muestras = subtotal_muestras + total_muestras[i];
    }

    $('#n_subtotal-facturas').html(subtotal_muestras);
}

function validar_muestra(data_muestra){
  console.log(data_muestra);
  if(data_muestra.producto != null){
    return data_muestra.producto;
  }else{
    return data_muestra.tipo_muestra;
  }
}

function editar_factura(){
    var responsable_pago = $('#responsable_pago_fact');
    var correo = $('#correo_fact');
    var num_fact = $('#numero_fact');
    var fecha_fact = $('#fecha_fact');
    var complemento_pago = $('#complemento_pago');
    var cobro_envio = $('#cobro_envio');
    var envio_fact = $('#envio_fact');
    var fecha_envio_fact = $('#fecha_envio_fact');
    var pago_fact = $('#pago_fact');
    var envio_informes = $('#envio_informes');
    var orden_compra = $('#orden_compra');
    var cantidad_pagada = $('#cantidad_pagada');

    $('#button_edit_factura').hide();
    $('#button_cancelar_edit').attr("hidden",false);
    $('#button_guardar_factura').attr("hidden",false);
    var dict = {
        1 : responsable_pago,
        2 : correo,
        3 : num_fact,
        4 : fecha_fact,
        5 : complemento_pago,
        6 : cobro_envio,
        7 : envio_fact,
        8 : fecha_envio_fact,
        9 : pago_fact,
        10 : envio_informes,
        11 : orden_compra,
        12 : cantidad_pagada
    }

    for(var campo in dict){
        var value = dict[campo];
        value.prop('disabled',false);
    }
}

function validar_factura(){
  var responsable_pago = $('#responsable_pago_fact').val();
  var correo = $('#correo_fact').val();
  var num_fact = $('#numero_fact').val();
  var fecha_fact = $('#fecha_fact').val();
  var complemento_pago = $('#complemento_pago').val();
  var cobro_envio = $('#cobro_envio').val();
  var envio_fact = $('#envio_fact').val();
  var fecha_envio_fact = $('#fecha_envio_fact').val();
  var pago_fact = $('#pago_fact').val();
  var envio_informes = $('#envio_informes').val();
  var orden_compra = $('#orden_compra').val();
  var cantidad_pagada = $('#cantidad_pagada').val();
  var dict = {
          1 : check_is_not_empty(responsable_pago, '#responsable_pago_fact'),
          3 : check_is_not_empty(correo, '#correo_fact'),
      }
  for(var key in dict) {
    var value = dict[key];
    var flag = true;
    if(value == false){
        flag = false
        break;
    }
  }
    if(flag == true){
        document.getElementById("submit-facturacion-form").submit();
    }
}

function success_code_fact_check(){
    $.ajax({
        url: "/reportes/notificar_editar_facturacion",
        data: {
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            if (response.result == 1){
                showNotificationSuccess('top','right','Factura guardada exitosamente');
            }
            if (response.result == -1){
                showNotificationDanger('top','right','Ocurrió un error, inténtelo de nuevo más tarde');
            }

        }
    });
}

function cancelar_editar_facturacion(){
    var responsable_pago = $('#responsable_pago_fact');
    var correo = $('#correo_fact');
    var num_fact = $('#numero_fact');
    var fecha_fact = $('#fecha_fact');
    var complemento_pago = $('#complemento_pago');
    var cobro_envio = $('#cobro_envio');
    var envio_fact = $('#envio_fact');
    var fecha_envio_fact = $('#fecha_envio_fact');
    var pago_fact = $('#pago_fact');
    var envio_informes = $('#envio_informes');
    var orden_compra = $('#orden_compra');
    var cantidad_pagada = $('#cantidad_pagada');
    $('#button_edit_factura').show();
    $('#button_cancelar_edit').attr("hidden",true);
    $('#button_guardar_factura').attr("hidden",true);
    var dict = {
        1 : responsable_pago,
        2 : correo,
        3 : num_fact,
        4 : fecha_fact,
        5 : complemento_pago,
        6 : cobro_envio,
        7 : envio_fact,
        8 : fecha_envio_fact,
        9 : pago_fact,
        10 : envio_informes,
        11 : orden_compra,
        12 : cantidad_pagada
    }

    for(var campo in dict){
        var value = dict[campo];
        value.prop('disabled',true);
    }
}

function sincronizar(id_muestra, value, id){
    $('tr[name="editar_muestra_'+ id_muestra +'[]"]').each(function (){
        $(this).find('#'+ id).val(value);
    });
}
