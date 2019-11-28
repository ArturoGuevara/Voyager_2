$('#btn-editar-perfil').click(function(){

    $('#perfil-info').removeClass('d-inline').addClass('d-none');
    $('#perfil-editar').removeClass('d-none').addClass('d-inline');
});

$('#btn-cancelar-perfil').click(function(){

    $('#perfil-editar').removeClass('d-inline').addClass('d-none');
    $('#perfil-info').removeClass('d-none').addClass('d-inline');
});
