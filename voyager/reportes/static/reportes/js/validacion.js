const regexNumber = /[0-9]{1}/;
const time = 5;

$(document).ready(function(){
   $("#dhl_code").on("keypress", justNumbers);
});

function justNumbers(e){
   return regexNumber.test(e.originalEvent.key);
}


$(document).ready(function() {
  $("#success-alert").hide();
  $("#alertmss").click(function showAlert() {
    $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {
      $("#success-alert").slideUp(500);
    });
  });
});