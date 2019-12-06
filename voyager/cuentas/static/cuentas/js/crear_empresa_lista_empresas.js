function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

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
    if(!check_is_not_empty($("#correo_compras").val(),"#correo_compras")){
        valid_form=false;
    }
    if(!check_is_not_empty($("#nombre_responsable_compras").val(),"#nombre_responsable_compras")){
        valid_form=false;
    }
    if(!isEmail($("#correo_resultados").val())){
        valid_form=false;
        $(".invalid-mail-resultados").prop('hidden', false);
    }
    else{
        $(".invalid-mail-resultados").prop('hidden', true);
    }
    if(!isEmail($("#correo_pagos").val())){
        valid_form=false;
        $(".invalid-mail-pagos").prop('hidden', false);
    }
    else{
        $(".invalid-mail-pagos").prop('hidden', true);
    }
    if(!isEmail($("#correo_compras").val())){
        valid_form=false;
        $(".invalid-mail-compras").prop('hidden', false);
    }
    else{
        $(".invalid-mail-compras").prop('hidden', true);
    }
    if(valid_form){
        guardar_empresa($("#nombre_empresa").val(),
                            $("#telefono_empresa").val(),
                            $("#correo_resultados").val(),
                            $("#correo_pagos").val(),
                            $("#correo_compras").val(),
                            $("#nombre_responsable_resultados").val(),
                            $("#nombre_responsable_pagos").val(),
                            $("#nombre_responsable_compras").val(),
                        );
        $("#nombre_empresa").val("");
        $("#telefono_empresa").val("");
        $("#correo_resultados").val("");
        $("#nombre_responsable_resultados").val("");
        $("#correo_pagos").val("");
        $("#nombre_responsable_pagos").val("");
        $("#correo_compras").val("");
        $("#nombre_responsable_compras").val("");
        $("#modal-crear-empresa").modal('toggle');
    }
}

function guardar_empresa(nombre_empresa,telefono_empresa,correo_resultados,correo_pagos,correo_compras,responsable_resultados,responsable_pagos,responsable_compras) {
    var token = csrftoken;
    $.ajax({
        url: "/cuentas/crear_empresa/",
        data: {
            nombre_empresa: nombre_empresa,
            telefono_empresa: telefono_empresa,
            correo_resultados: correo_resultados,
            correo_pagos: correo_pagos,
            correo_compras: correo_compras,
            nombre_responsable_resultados: responsable_resultados,
            nombre_responsable_pagos: responsable_pagos,
            nombre_responsable_compras: responsable_compras,
            'csrfmiddlewaretoken': token,
        },
        type: "POST",
        success: function(response){
            // Damos retroalimentación de que se guardó correctamente
            showNotificationSuccess('top', 'right', 'Empresa guardada correctamente');
            showNotificationWarning('top', 'right', 'La página se refrescará en un momento');

            setTimeout(function () {
                location.reload();
            }, 2000);
        },
    });
}