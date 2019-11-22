function cargar_csv(){
  console.log("Si jala");
  var id_oi = id;
  var token = csrftoken;
  $.ajax({
      url: "/reportes/consultar_empresa_muestras/",
      data: {
          id: id,
          'csrfmiddlewaretoken': token,
      },
      type: "POST",
      success: function(response){
          var data = JSON.parse(response.data);
          var muestras = JSON.parse(response.muestras);
          $('#email_destino').val(data[0].fields.correo_resultados);
          var html_drop = dropdown_muestras(muestras);
          $('#muestra').html(html_drop);
      },
      error: function(data){
          $('#modal-enviar-resultados').modal('toggle');// Cerrar el modal de enviar resultados
      }
  });
}
