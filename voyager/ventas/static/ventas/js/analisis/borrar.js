/* Funciones para borrar análisis */
function borrar_analisis(id){
   if(id > 0){
       id_analisis = id;
   }
}
function confirmar_borrar(){
    if(id_analisis>0){
        var id = id_analisis;
        var token = csrftoken;
        $.ajax({
            url: "borrar_analisis/"+id,
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(){
                borrar_analisis_tabla('.analisis-row',id);
                showNotification('top','right','Tu análisis ha sido borrado exitosamente');
                id_analisis = 0;
                $('#borrar_analisis').modal('toggle');
            },
            error: function(data){
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    }
}