/* FUNCIONES QUE SE EJECUTAN AL CARGAR LA PÁGINA */
$(document).ready(function() {
    
});

/* FUNCIONES DE BOTONES/MODALS PARA MOSTRAR/OCULTAR LA EDICIÓN DE UNA COTIZACIÓN */
function restaurar_modal_ver_cot(){
    // Alternar botones
    $('#btn-canc-edit-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-guar-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-editar-cot').removeClass('d-none').addClass('d-inline');

    // Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-none').addClass('d-block');
    $('#editar-resumen-cot').removeClass('d-block').addClass('d-none');
    
    // Limpiar tabla de resumen de análisis al editar
    $('#editar-cot-tabla-analisis-resumen').empty();
}
$('#btn-editar-cot').click(function(){
    // Alternar botones
    $(this).removeClass('d-inline').addClass('d-none');
    $('#btn-canc-edit-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-guar-editar-cot').removeClass('d-none').addClass('d-inline');

    //Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-block').addClass('d-none');
    $('#editar-resumen-cot').removeClass('d-none').addClass('d-block');
});
$('#btn-canc-edit-cot').click(function(){
    restaurar_modal_ver_cot();
});
$('#ver_cotizacion').on('hidden.bs.modal', function () {
    restaurar_modal_ver_cot();
});

/* FUNCIONES AL EDITAR LOS ANÁLISIS DE LA COTIZACION */
$("input[name='editar-cot[]']").click(function (){
    // Limpiamos la tabla para agregar los que están seleccionados nada más
    $('#editar-cot-tabla-analisis-resumen').empty();
    // Obtenemos los checkboxes que estén clickeados
    var checked = [];
    $('input[name="editar-cot[]"]:checked').each(function (){
        checked.push(parseInt($(this).val()));
    });
    // Hacemos la llamada Ajax para obtener la información de los análisis seleccionados
});