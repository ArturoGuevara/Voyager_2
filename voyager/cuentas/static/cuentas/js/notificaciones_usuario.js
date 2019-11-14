$(document).ready(function(){
    verificar_notificaciones();
});

function verificar_notificaciones(){
    $.ajax({
        url: '/cuentas/notificar_crear_staff/',
        dataType: 'json',
        success : function(response){
            if (response.result == true){
                showNotification('top','right','Se ha guardado el usuario exitosamente');
            }else if (response.result == false){
                showNotification('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde');
            }else{

            }
        }
    });
}
