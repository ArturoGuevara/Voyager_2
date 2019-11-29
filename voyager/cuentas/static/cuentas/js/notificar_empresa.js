$(document).ready(function(){
    verificar_editar();
    verificar_borrar();
});

function verificar_editar(){
    $.ajax({
        url: '/cuentas/notificar_editar_empresa/',
        dataType: 'json',
        success : function(response){
            if (response.result == true){
                showNotificationSuccess('top','right','Se ha modificado la empresa exitosamente');
            }else if (response.result == false){
                showNotificationDanger('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde');
            }else{

            }
        }
    });
}

function verificar_borrar(){
    $.ajax({
        url: '/cuentas/notificar_borrar_empresa/',
        dataType: 'json',
        success : function(response){
            if (response.result == true){
                showNotificationSuccess('top','right','Se ha eliminado la empresa exitosamente');
            }else if (response.result == false){
                showNotificationDanger('top','right','Ha ocurrido un error, inténtelo de nuevo más tarde');
            }else{

            }
        }
    });
}
