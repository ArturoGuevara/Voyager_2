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
            var responsable_resultados = response.responsable_resultados;
            var correo_resultados = response.correo_resultados;
            var responsable_pagos = response.responsable_pagos;
            var correo_pagos = response.correo_pagos;
            var id = response.id;
            $("#visualizar_nombre").val(nombre_empresa);
            $("#editar_nombre").val(nombre_empresa);
            $("#visualizar_telefono").val(telefono);
            $("#editar_telefono").val(telefono);
            $("#visualizar_responsable_resultados").val(responsable_resultados);
            $("#editar_responsable_resultados").val(responsable_resultados);
            $("#visualizar_correo_resultados").val(correo_resultados);
            $("#editar_correo_resultados").val(correo_resultados);
            $("#visualizar_responsable_pagos").val(responsable_pagos);
            $("#editar_responsable_pagos").val(responsable_pagos);
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
    if(!check_is_not_empty($("#editar_nombre").val(),'#editar_nombre')){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_telefono").val(),"#editar_telefono")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_responsable_resultados").val(),"#editar_responsable_resultados")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_correo_resultados").val(),"#editar_correo_resultados")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_responsable_pagos").val(),"#editar_responsable_pagos")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#editar_correo_pagos").val(),"#editar_correo_pagos")){
        valid_form=false;
    }
    if(valid_form){
        document.getElementById("editar_empresa_form").submit();
    }
}

function eliminar_info_empresa(id) {
    $("#eliminar_empresa_id").val(id);
}