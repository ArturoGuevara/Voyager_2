$('#btn-todos').click(function(){

  $('#todos').removeClass('d-none').addClass('d-inline');
  $('#activos').removeClass('d-inline').addClass('d-none');
  $('#inactivos').removeClass('d-inline').addClass('d-none');

  $('#btn-todos').removeClass('d-inline').addClass('d-none');
  $('#btn-activos').removeClass('d-none').addClass('d-inline');
  $('#btn-inactivos').removeClass('d-none').addClass('d-inline');

});

$('#btn-activos').click(function(){

    $('#todos').removeClass('d-inline').addClass('d-none');
    $('#activos').removeClass('d-none').addClass('d-inline');
    $('#inactivos').removeClass('d-inline').addClass('d-none');

    $('#btn-todos').removeClass('d-none').addClass('d-inline');
    $('#btn-activos').removeClass('d-inline').addClass('d-none');
    $('#btn-inactivos').removeClass('d-none').addClass('d-inline');

});

$('#btn-inactivos').click(function(){

    $('#todos').removeClass('d-inline').addClass('d-none');
    $('#activos').removeClass('d-inline').addClass('d-none');
    $('#inactivos').removeClass('d-none').addClass('d-inline');

    $('#btn-todos').removeClass('d-none').addClass('d-inline');
    $('#btn-activos').removeClass('d-none').addClass('d-inline');
    $('#btn-inactivos').removeClass('d-inline').addClass('d-none');

});
