function enviar_empresa(){
    var valid_form = true;
    if(!check_is_not_empty($("#nombre_empresa").val(),'#nombre_empresa')){
        valid_form=false;
    }
    if(!check_is_not_empty($("#telefono_empresa").val(),"#telefono_empresa")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#correo_resultados").val(),"#correo_resultados")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#nombre_responsable_resultados").val(),"#nombre_responsable_resultados")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#correo_pagos").val(),"#correo_pagos")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#nombre_responsable_pagos").val(),"#nombre_responsable_pagos")){
        valid_form=false;
    }
    if(valid_form){
        guardar_empresa($("#nombre_empresa").val(),
                            $("#telefono_empresa").val(),
                            $("#correo_resultados").val(),
                            $("#correo_pagos").val(),
                            $("#nombre_responsable_resultados").val(),
                            $("#nombre_responsable_pagos").val(),
                        );
        $("#nombre_empresa").val("");
        $("#telefono_empresa").val("");
        $("#correo_resultados").val("");
        $("#nombre_responsable_resultados").val("");
        $("#correo_pagos").val("");
        $("#nombre_responsable_pagos").val("");
        $("#modal-crear-empresa").modal('toggle');
    }
}

function guardar_empresa(nombre_empresa,telefono_empresa,correo_resultados,correo_pagos,responsable_resultados,responsable_pagos) {
    var token = csrftoken;
    $.ajax({
        url: "/cuentas/crear_empresa/",
        data: {
            nombre_empresa: nombre_empresa,
            telefono_empresa: telefono_empresa,
            correo_resultados: correo_resultados,
            correo_pagos: correo_pagos,
            nombre_responsable_resultados: responsable_resultados,
            nombre_responsable_pagos: responsable_pagos,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            var nombre_empresa_guardado = response.nombre;
            var id_empresa_guardado = response.value;
            var new_option = "<option value='"+id_empresa_guardado+"'>"+nombre_empresa_guardado+"</option>";
            $("#id_empresa").append(new_option);
        },
    });
}