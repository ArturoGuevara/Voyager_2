var correo_verificar = false;

var token = csrftoken;
$(document).ready(function () {
  $("#correo").on("keyup",val_mail);
  $("#contraseña").on("keyup",val_passwords);
  $("#contraseña2").on("keyup",val_passwords);
});

function val_mail(e){   //Solo permite numeros en textbox
  $.ajax({
      url: '../verificar_correo/',
      type: 'POST',
      dataType: 'json',
      data: {
          'correo' : $('#correo').val(),
          'csrfmiddlewaretoken': token
      },
      success : function (response) {
         if(response.num_mails>0){
             $("#submit").prop('disabled', true);
             if($('#correo').val()!='') {
                 $(".invalid_mail").prop('hidden', false);
                 correo_verificar = false;
             }
         }
         else{
             $("#submit").prop('disabled', false);
             $(".invalid_mail").prop('hidden', true);
             correo_verificar = true;
         }
      }
  });
}

function val_passwords(e){
  if($("#contraseña").val()!=$("#contraseña2").val()){
      $("#submit").prop('disabled', true);
      $(".invalid_password").prop('hidden', false);
  }
  else{
      if(correo_verificar){
          $("#submit").prop('disabled', false);
      }
      $(".invalid_password").prop('hidden', true);
  }
}