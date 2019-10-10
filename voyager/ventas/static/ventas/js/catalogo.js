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

function ver_analisis(id){
    
}