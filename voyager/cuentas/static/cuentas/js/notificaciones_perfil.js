$(document).ready(function(){
    verificar_guardar();
    verificar_error();
});

function verificar_guardar(){
    $.ajax({
        url: '/cuentas/notificar_guardar_perfil/',
        dataType: 'json',
        success : function(response){
            if (response.result == true){
                showNotificationSuccess('top','right','Se ha actualizado la información exitosamente');
            }
            else if (response.result == false){
                showNotificationDanger('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde');
            }
        }
    });
}

function verificar_error(){
    $.ajax({
        url: '/cuentas/notificar_error_perfil/',
        dataType: 'json',
        success : function(response){
            if (response.result == true){
                showNotificationInfo('top','right','La contraseña de verificación ingresada fue incorrecta');
            }
        }
    });
}
