//var token = csrftoken;

function cargar_info_empresa(id) {
    var token = csrftoken;
    $.ajax({
        url: "/cuentas/consultar_empresa/",
        type: "POST",
        dataType: 'json',
        data: {
            'id':id,
            'csrfmiddlewaretoken': token,
        },
        success: function (response) {
            var nombre_empresa = response.nombre;
            var telefono = response.telefono;
            var correo_resultados = response.correo_resultados;
            var correo_pagos = response.correo_pagos;
            var id = response.id;
            $("#visualizar_nombre").val(nombre_empresa);
            $("#editar_nombre").val(nombre_empresa);
            $("#visualizar_telefono").val(telefono);
            $("#editar_telefono").val(telefono);
            $("#visualizar_correo_resultados").val(correo_resultados);
            $("#editar_correo_resultados").val(correo_resultados);
            $("#visualizar_correo_pagos").val(correo_pagos);
            $("#editar_correo_pagos").val(correo_pagos);
            $("#empresa_id").val(id);
        }
    })
}

function visualizar_editar() {
    $("#visualizar-info-empresa").removeClass('d-block').addClass('d-none');
    $("#btn-editar-empresa").removeClass('d-block').addClass('d-none');
    $("#editar-info-empresa").removeClass('d-none').addClass('d-block');
    $("#btn-cancelar-cambios").removeClass('d-none').addClass('d-block');
    $("#btn-guardar-cambios").removeClass('d-none').addClass('d-block');
}

function cancelar_editar() {
    $("#visualizar-info-empresa").removeClass('d-none').addClass('d-block');
    $("#btn-editar-empresa").removeClass('d-none').addClass('d-block');
    $("#editar-info-empresa").removeClass('d-block').addClass('d-none');
    $("#btn-cancelar-cambios").removeClass('d-block').addClass('d-none');
    $("#btn-guardar-cambios").removeClass('d-block').addClass('d-none');
}

function editar_empresa(){
    var valid_form = true;
    if(!check_is_not_empty($("#editar_nombre").val(),'#nombre_empresa')){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_telefono").val(),"#telefono_empresa")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_correo_resultados").val(),"#correo_resultados")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_correo_pagos").val(),"#correo_pagos")){
        valid_form=false;
    }
    if(valid_form){
        document.getElementById("editar_empresa_form").submit();
        /*cambios_empresa($("#editar_nombre").val(),
                            $("#editar_telefono").val(),
                            $("#editar_correo_resultados").val(),
                            $("#editar_correo_pagos").val(),
                            $("#empresa_id").val(),
                        );
        $("#editar_nombre").val("");
        $("#editar_telefono").val("");
        $("#editar_correo_resultados").val("");
        $("#editar_correo_pagos").val("");
        $("#modal_info_empresa").modal('toggle');
        $("#visualizar-info-empresa").removeClass('d-none').addClass('d-block');
        $("#btn-editar-empresa").removeClass('d-none').addClass('d-block');
        $("#editar-info-empresa").removeClass('d-block').addClass('d-none');
        $("#btn-cancelar-cambios").removeClass('d-block').addClass('d-none');
        $("#btn-guardar-cambios").removeClass('d-block').addClass('d-none');*/
    }
}

/*function cambios_empresa(nombre_empresa,telefono_empresa,correo_resultados,correo_pagos,id_empresa) {
    var token = csrftoken;
    $.ajax({
        url: "/cuentas/editar_empresa/",
        data: {
            nombre_empresa: nombre_empresa,
            telefono_empresa: telefono_empresa,
            correo_resultados: correo_resultados,
            correo_pagos: correo_pagos,
            id_empresa: id_empresa,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            var nombre_empresa_guardado = response.nombre;
            var telefono_empresa_guardado = response.telefono;
            var correo_resultados_guardado = response.correo_resultados;
            var correo_pagos_guardado = response.correo_pagos;
            var id_empresa_guardado = response.id;
            var upd_row ="<td>"+nombre_empresa_guardado+"</td>";
            upd_row = upd_row + "<td>"+telefono_empresa_guardado+"</td>";
            upd_row = upd_row + "<td>"+correo_resultados_guardado+"</td>";
            upd_row = upd_row + "<td>"+correo_pagos_guardado+"</td>";
            upd_row = upd_row +
                    `<td>
                        <button type='button' class='btn btn-primary' onclick='cargar_info_empresa({{e.id}})' data-toggle='modal' data-target='#modal_info_empresa'>
                            <i class='fas fa-eye'></i>
                        </button>
                        <button id='btn-trash' type='button' class='btn btn-danger d-inline'>
                            <i class='fas fa-trash'></i>
                        </button>
                    </td>`
            var new_row_id = "#empresa-"+id_empresa_guardado;
            $(new_row_id).html(upd_row);
        },
    });
}*/