function restaurar_modal_oi() {
    // Organizar botones
    $('#btn-editar-oi').removeClass().addClass('btn btn-primary d-block');
    $('#btn-cancelar-editar-oi').removeClass().addClass('btn btn-danger d-none float-left');
    // Organizar contenedores
    $('#ver-resumen-oi').removeClass().addClass('d-block');
    $('#editar-info-oi').removeClass().addClass('d-none');
    $('#confirmar-cambios-oi').removeClass().addClass('d-none');
    // Limpiamos los inputs de los forms
    $("#editar-info-oi").find(':input').each(function(){
        switch(this.type){
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
            case 'select-multiple':
            case 'date':
            case 'number':
            case 'tel':
            case 'email':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
                break;
        }
    });
}

$('#modal-visualizar-orden').on('hidden.bs.modal', function () {
    restaurar_modal_oi();
    $('.registro-tabla-factura-oi').remove();
});

$('#btn-editar-oi').click(function () {
    // Alternar botones
    $(this).removeClass('d-block').addClass('d-none');
    $('#btn-cancelar-editar-oi').removeClass('d-none').addClass('d-block');
    $('#btn-guardar-oi').removeClass('d-none').addClass('d-block');

    //Alternar contenedores
    $('#ver-resumen-oi').removeClass('d-block').addClass('d-none');
    $('#editar-info-oi').removeClass('d-none').addClass('d-block');
});

$('#btn-continuar-oi').click(function () {
    // Alternar botones
    $(this).removeClass('d-block').addClass('d-none');
    $('#btn-cancelar-editar-oi').removeClass('d-block').addClass('d-none');
    $('#btn-guardar-oi').removeClass('d-none').addClass('d-block');
    $('#btn-regresar-oi').removeClass('d-none').addClass('d-block');

    //Alternar contenedores
    $('#editar-info-oi').removeClass('d-block').addClass('d-none');
    $('#confirmar-cambios-oi').removeClass('d-none').addClass('d-block');
});

$('#btn-cancelar-editar-oi').click(function () {
    // Alternar botones
    $(this).removeClass('d-block').addClass('d-none');
    $('#btn-continuar-oi').removeClass('d-block').addClass('d-none');
    $('#btn-editar-oi').removeClass('d-none').addClass('d-block');

    //Alternar contenedores
    $('#editar-info-oi').removeClass('d-block').addClass('d-none');
    $('#ver-resumen-oi').removeClass('d-none').addClass('d-block');
});

$('#btn-regresar-oi').click(function () {
    // Alternar botones
    $(this).removeClass('d-block').addClass('d-none');

    $('#btn-cancelar-editar-oi').removeClass('d-none').addClass('d-block');
    $('#btn-continuar-oi').removeClass('d-none').addClass('d-block');

    //Alternar contenedores
    $('#confirmar-cambios-oi').removeClass('d-block').addClass('d-none');
    $('#editar-info-oi').removeClass('d-none').addClass('d-block');
});

function doble_editar(){
    $('#btn-editar-oi').removeClass('d-block').addClass('d-none');
}

function restaurar_editar(){
    if ($('#btn-editar-oi').hasClass('d-none')){
        $('#btn-editar-oi').removeClass('d-none').addClass('d-block');
    }
}
