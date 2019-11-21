function restaurar_perfil(){
    // Alternar botones
    $('#btn-canc-edit-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-guar-editar-cot').removeClass('d-inline').addClass('d-none');
    $('#btn-editar-cot').removeClass('d-none').addClass('d-inline');
    $('#btn-space-edit').removeClass('d-none');

    // Alternar contenedores
    $('#ver-resumen-cot').removeClass('d-none').addClass('d-block');
    $('#editar-resumen-cot').removeClass('d-block').addClass('d-none');

    // Limpiar tabla de resumen de análisis al editar
    $('#editar-cot-tabla-analisis-resumen').empty();

    // Deseleccionamos los análisis checados en la tabla
    $("input[name='editar-cot-an[]']:checked").each(function () {
        $(this).prop('checked', false);
    });

    // Hacemos que la tab de información general sea la activa
    $('#nav-info-tab').removeClass().addClass('nav-item nav-link active');
    $('#nav-analisis-tab').removeClass().addClass('nav-item nav-link');
    $('#nav-info').removeClass().addClass('tab-pane fade show active');
    $('#nav-analisis').removeClass().addClass('tab-pane fade');
}
$('#btn-editar-perfil').click(function(){

    $('#perfil-info').removeClass('d-inline').addClass('d-none');
    $('#perfil-editar').removeClass('d-none').addClass('d-inline');
});

$('#btn-cancelar-perfil').click(function(){

    $('#perfil-editar').removeClass('d-inline').addClass('d-none');
    $('#perfil-info').removeClass('d-none').addClass('d-inline');
});
