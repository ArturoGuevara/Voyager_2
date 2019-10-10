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
                //console.log(response.data);
                //console.log(response["data"][2]["nombre"]);
                var data = JSON.parse(response.data);
                
                
                // Precargamos los datos en los span
                $('#codigo_analisis').html(data.fields.codigo);
                $('#nombre_analisis').html(data.fields.nombre);
                $('#precio_analisis').html(data.fields.precio);
                $('#fecha_analisis').html(data.fields.tiempo);
                $('#descripcion_analisis').html(data.fields.descripcion);
                
                // Precargamos los datos en los input
                $('#editar_codigo_analisis').val(data.fields.codigo);
                $('#editar_nombre_analisis').val(data.fields.nombre);
                $('#editar_precio_analisis').val(data.fields.precio);
                $('#editar_fecha_analisis').val(data.fields.tiempo);
                $('#editar_desc_analisis').val(data.fields.descripcion);
            }
        });
    }
}

function editar_analisis(id){
    if(id > 0){
        console.log(id);
        $.ajax({
            url: "php/control-events.php?ev=1",
            data: {id:id},
            type: "POST",
            success: function(data){
                myResult = data.split('||');
                
            }
        });
    }
}