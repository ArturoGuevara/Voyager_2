// Cuando se da click en el botón de editar esconder bloque de info y mostrar el de inputs
$('#btn-editar-analisis').click(function(){
    $(this).removeClass('d-block').addClass('d-none');
    $('#btn-guardar-cambios').removeClass('d-none').addClass('d-block');
    $('#ver_info').removeClass('d-block').addClass('d-none');
    $('#editar_info').removeClass('d-none').addClass('d-block');
});

$('#btn-guardar-cambios').click(function(){
    $(this).removeClass('d-block').addClass('d-none');
    $('#btn-confirmar-cambios').removeClass('d-none').addClass('d-block');
    $('#editar_info').removeClass('d-block').addClass('d-none');
    $('#confirmar_info').removeClass('d-none').addClass('d-block');
    $('#confirmar_codigo_analisis').html($('#editar_codigo_analisis').val());
    $('#confirmar_nombre_analisis').html($('#editar_nombre_analisis').val());
    $('#confirmar_precio_analisis').html($('#editar_precio_analisis').val());
    $('#confirmar_fecha_analisis').html($('#editar-duracion').val());
    $('#confirmar_descripcion_analisis').html($('#editar_desc_analisis').val());
});

/* Funciones para ver y editar análisis */
function cargar_analisis(id){
    // El id de análisis tiene que existir
    if(id > 0){
        // Obtenemos el token de django para el ajax y el id guardada previamente al cargar el modal
        var token = csrftoken;
        $.ajax({
            url: "cargar_analisis/"+id,
            dataType: 'json',
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(response){
                // Obtener la info que se regresa del controlador
                var data = JSON.parse(response.data);
                // Precargamos los datos en los span
                cargar_info_modal_ver(data.fields.codigo,data.fields.nombre,data.fields.precio,data.fields.tiempo,data.fields.descripcion);
                // Precargamos los datos en los input
                cargar_info_modal_editar(data.fields.codigo,data.fields.nombre,data.fields.precio,data.fields.tiempo,data.fields.descripcion);
                // Guardamos en la variable global la id del análisis que se está visualizando por si se quiere modificar
                id_analisis = id;
            },
            error: function(data){
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    }
}
function editar_analisis(){
    // Obtenemos la id guardada previamente al cargar el modal para checar que existe
    var id = id_analisis;
    if(id > 0){
        // Obtenemos el token de django para el ajax
        var token = csrftoken;
        // Obtener valor de los inputs
        var nombre = $('#editar_nombre_analisis').val();
        var codigo = $('#editar_codigo_analisis').val();
        var descripcion = $('#editar_desc_analisis').val();
        var precio = $('#editar_precio_analisis').val();
        var tiempo =  $('#editar-duracion').val();

        // Validar que los inputs no estén vacíos
        check_is_not_empty(nombre,'#editar_nombre_analisis');
        check_is_not_empty(codigo,'#editar_codigo_analisis');
        check_is_not_empty(descripcion,'#editar_desc_analisis');
        check_is_not_empty(precio,'#editar_precio_analisis');
        check_is_not_empty(tiempo,'#editar-duracion');

        $.ajax({
            url: "editar_analisis/"+id,
            dataType: 'json',
            // Seleccionar información que se mandara al controlador
            data: {
                id:id,
                nombre: nombre,
                codigo: codigo,
                descripcion: descripcion,
                precio: precio,
                tiempo: tiempo,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(response){
                // Obtener la info que se regresa del controlador
                var data = JSON.parse(response.data);
                // Actualizar los valores en la tabla donde están todos los análisis
                cambiar_valores_analisis_tabla('.analisis-codigo', data.fields.codigo, id);
                cambiar_valores_analisis_tabla('.analisis-nombre', data.fields.nombre, id);
                cambiar_valores_analisis_tabla('.analisis-desc', data.fields.descripcion, id);
                cambiar_valores_analisis_tabla('.analisis-precio', '$'+data.fields.precio, id);
                cambiar_valores_analisis_tabla('.analisis-tiempo', data.fields.tiempo, id);

                // Si todo salió bien esconderemos el bloque de editar y mostraremos el de visualizar
                $('#ver_analisis').modal('hide');

                // Damos retroalimentación de que se guardó correctamente
                showNotification('top','right','Cambios guardados correctamente');

                id_analisis = 0;
            },
            error: function(data){
                // Código de error alert(data.status);
                // Mensaje de error alert(data.responseJSON.error);
            }
        });
    }
}

// Editar análisis
$(function(){
    $("#slider-range-editar").slider({
        range: true,
        min: 0,
        max: 20,
        values: [ 0, 20 ],
        slide: function( event, ui ) {
            $("#editar-duracion").val( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " días" );
        }
    });
    $("#editar-duracion").val( $("#slider-range-editar").slider("values",0) + " - " + $("#slider-range-editar").slider("values", 1) + " días");
});