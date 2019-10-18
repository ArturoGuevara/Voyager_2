// Variable que guarda la id de análisis a cargar
var id_analisis;

/* Funciones que se ejecutan al cargar la página */
$(document).ready(function() {
    // Cuando se da click en el botón de editar esconder bloque de info y mostrar el de inputs
    $('#btn-editar-analisis').click(function(){
        $(this).removeClass('d-block').addClass('d-none');
        $('#btn-guardar-cambios').removeClass('d-none').addClass('d-block');
        $('#ver_info').removeClass('d-block').addClass('d-none');
        $('#editar_info').removeClass('d-none').addClass('d-block');
    });
    // Cuando se cierra el modal de bootstrap por dar click afuera, esconder bloque de inputs y mostrar el de info
    $('#ver_analisis').on('hidden.bs.modal', function () {
        $('#ver_info').removeClass('d-none').addClass('d-block');
        $('#editar_info').removeClass('d-block').addClass('d-none');
        $('#btn-editar-analisis').removeClass('d-none').addClass('d-block');
        $('#btn-guardar-cambios').removeClass('d-block').addClass('d-none');
    });
    // Cuando se cierra el modal de bootstrap por dar click afuera, esconder bloque de inputs y mostrar el de info
    $('#borrar_analisis').on('hidden.bs.modal', function () {
       id_analisis = 0;
    });

    // Cerrar alert de retroalimentación en caso de hacer un registro de analisis
    setTimeout(function(){
       $("#alert").hide();
    }, 3000);

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
                // Código de error
                alert(data.status);
                // Mensaje de error
                alert(data.responseJSON.error);
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
        var tiempo =  $('#editar_fecha_analisis').val();

        // Validar que los inputs no estén vacíos
        check_is_not_empty(nombre,'#editar_nombre_analisis');
        check_is_not_empty(codigo,'#editar_codigo_analisis');
        check_is_not_empty(descripcion,'#editar_desc_analisis');
        check_is_not_empty(precio,'#editar_precio_analisis');
        check_is_not_empty(tiempo,'#editar_fecha_analisis');

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
                cambiar_valores_analisis_tabla('.analisis-precio', data.fields.precio, id);
                cambiar_valores_analisis_tabla('.analisis-tiempo', data.fields.tiempo, id);
                // Actualizar información en bloque de visualización de análisis
                cargar_info_modal_ver(data.fields.codigo, data.fields.nombre, data.fields.precio, data.fields.tiempo, data.fields.descripcion);

                // Si todo salió bien esconderemos el bloque de editar y mostraremos el de editar
                $('#btn-guardar-cambios').removeClass('d-block').addClass('d-none');
                $('#btn-editar-analisis').removeClass('d-none').addClass('d-block');
                $('#ver_info').removeClass('d-none').addClass('d-block');
                $('#editar_info').removeClass('d-block').addClass('d-none');

                // Damos retroalimentación de que se guardó correctamente
                showNotification('top','right','Cambios guardados correctamente');

                id_analisis = 0;
            },
            error: function(data){
                // Código de error
                alert(data.status);
                // Mensaje de error
                alert(data.responseJSON.error);
            }
        });
    }
}
/* Funciones para borrar análisis */
function borrar_analisis(id){
   id_analisis = id;
   if( id>0 ) {
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
        });
    }
}

/* Funciones para reemplazar valores en la tabla e inputs */
function cargar_info_modal_ver(codigo, nombre, precio, tiempo, descripcion){
    $('#codigo_analisis').html(codigo);
    $('#nombre_analisis').html(nombre);
    $('#precio_analisis').html(precio);
    $('#fecha_analisis').html(tiempo);
    $('#descripcion_analisis').html(descripcion);
}
function cargar_info_modal_editar(codigo, nombre, precio, tiempo, descripcion){
    $('#editar_codigo_analisis').val(codigo);
    $('#editar_nombre_analisis').val(nombre);
    $('#editar_precio_analisis').val(precio);
    $('#editar_fecha_analisis').val(tiempo);
    $('#editar_desc_analisis').val(descripcion);
}
function cambiar_valores_analisis_tabla(clase,value,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           $(e).html(value);
       }
    });
}
function borrar_analisis_tabla(clase,id){
    $(clase).each(function(i,e){
       if( $(e).data('id') == id ){
           $(e).remove();
       }
    });
}

// Función que crea y muestra alerta
function showNotification(from, align, msg){
	color = Math.floor((Math.random() * 4) + 1);
	$.notify({
		icon: "nc-icon nc-app",
		message: msg
	},{
		timer: 4000,
		placement: {
			from: from,
			align: align
		}
	});
}
