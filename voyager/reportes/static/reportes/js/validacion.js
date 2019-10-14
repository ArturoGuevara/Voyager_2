const regexNumber = /[0-9]{1}/;
const time = 5;

$(document).ready(function(){
   $("#dhl_code").on("keypress", justNumbers);
});

function justNumbers(e){
   return regexNumber.test(e.originalEvent.key);
}


$(document).ready(function() {
   if($("#success-alert").data("show") == 1){
      $("#success-alert").removeClass('d-none');
      setTimeout(function(){
         $("#success-alert").hide();
      }, 3000);
   }
});