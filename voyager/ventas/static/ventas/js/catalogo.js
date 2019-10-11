var id_analisis;

// Función para mostrar notificación
function showNotification(from, align, message_user){
	color = Math.floor((Math.random() * 4) + 1);
	$.notify({
		icon: "pe-7s-gift",
		message: message_user
	},{
		type: type[color],
		timer: 4000,
		placement: {
			from: from,
			align: align
		}
	});
}
// Función para checar que no estén vacíos los campos
var checkIsNotEmpty = function(auxiliar, name){
    if(auxiliar == '' || auxiliar == null){
        var msg = 'Por favor completa el campo de: ' + name;
        showNotification('top', 'center', msg)
        return false;
    }
    return true;
}
// Función para checar si un campo tiene números en su strings
var checkHasNoNumbers = function(auxiliar, name){
    if(/\d/.test(auxiliar)){
        var msg = 'Por favor remueve los números del campo de: ' + name;
        showNotification('top', 'center', msg)
        return false;
    }
    return true;
}
// Función para checar si un campo tiene letras en su string de puros números
var checkHasNumbers = function(auxiliar, name){
    if(/[^0-9]/.test(auxiliar)){
        var msg = 'Por favor remueve cualquier caracter que no sea número del campo de: ' + name;
        showNotification('top', 'center', msg)
        return false;
    }
    return true;
}

$(document).ready(function() {
    $('#btn-editar-analisis').click(function(){
        $(this).removeClass('d-block').addClass('d-none');
        $('#btn-guardar-cambios').removeClass('d-none').addClass('d-block');
        $('#ver_info').removeClass('d-block').addClass('d-none');
        $('#editar_info').removeClass('d-none').addClass('d-block');
    });
    $('#btn-guardar-cambios').click(function(){
        $(this).removeClass('d-block').addClass('d-none');
        $('#btn-editar-analisis').removeClass('d-none').addClass('d-block');
        $('#ver_info').removeClass('d-none').addClass('d-block');
        $('#editar_info').removeClass('d-block').addClass('d-none');
    });
    $('#ver_analisis').on('hidden.bs.modal', function () {
        $('#ver_info').removeClass('d-none').addClass('d-block');
        $('#editar_info').removeClass('d-block').addClass('d-none');
        $('#btn-editar-analisis').removeClass('d-none').addClass('d-block');
        $('#btn-guardar-cambios').removeClass('d-block').addClass('d-none');
    });
});

function cargar_analisis(id){
    if(id > 0){
        console.log(id);
        var token = csrftoken;
        $.ajax({
            url: "cargar_analisis/"+id,
            dataType: 'json',
            data: {
                id:id,
                'csrfmiddlewaretoken': token
            },
            type: "POST",
            success: function(response){
                var data = JSON.parse(response.data);
                
                // Precargamos los datos en los span
                cargar_info_modal_ver(data.fields.codigo,data.fields.nombre,data.fields.precio,data.fields.tiempo,data.fields.descripcion);
                
                // Precargamos los datos en los input
                cargar_info_modal_editar(data.fields.codigo,data.fields.nombre,data.fields.precio,data.fields.tiempo,data.fields.descripcion);
                
                id_analisis = id;
            }
        });
    }
}

function editar_analisis(){
    var token = csrftoken;
    var id = id_analisis;
    if(id > 0){
        var nombre = $('#editar_nombre_analisis').val();
        var codigo = $('#editar_codigo_analisis').val();
        var descripcion = $('#editar_desc_analisis').val();
        var precio = $('#editar_precio_analisis').val();
        var tiempo =  $('#editar_fecha_analisis').val();
        
        var flag = 0;
        if(checkIsNotEmpty(name,'Nombre')){
            if(checkIsNotEmpty(codigo,'Código')){
                if(checkIsNotEmpty(descripcion,'Descripción')){
                    if(checkIsNotEmpty(precio,'Precio')){
                        if(checkIsNotEmpty(tiempo,'Tiempo')){
                            flag = 1;
                        }
                    }
                }
            }
        }
        if(flag == 1){
            $.ajax({
                url: "editar_analisis/"+id,
                dataType: 'json',
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
                    var data = JSON.parse(response.data);
                    console.log(data);

                    cambiar_valores_analisis_tabla('.analisis-codigo', data.fields.codigo, id);
                    cambiar_valores_analisis_tabla('.analisis-nombre', data.fields.nombre, id);
                    cambiar_valores_analisis_tabla('.analisis-desc', data.fields.descripcion, id);
                    cambiar_valores_analisis_tabla('.analisis-precio', data.fields.precio, id);
                    cambiar_valores_analisis_tabla('.analisis-tiempo', data.fields.tiempo, id);

                    cargar_info_modal_ver(data.fields.codigo, data.fields.nombre, data.fields.precio, data.fields.tiempo, data.fields.descripcion);
                }
            });
        }
    }
}

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