const regexNumber = /[0-9]{1}/;
const time = 5;


$(document).ready(function(){ //Se llama cuando se presiona una tecla en textbox de DHL code
   $("#dhl_code").on("keypress", justNumbers);
});


function justNumbers(e){   //Solo permite numeros en textbox
   return regexNumber.test(e.originalEvent.key);
}

function valid_check(num){

   id = "#mselected" + String(num);
   $(id).addClass('d-none');
}


$(document).ready(function() {   //Esconde alert de retroalimentación de DHL una vez que se muestra
   if($("#success-alert").data("show") == 1){
      $("#success-alert").removeClass('d-none');
      setTimeout(function(){
         $("#success-alert").hide();
      }, 3000);
   }
});