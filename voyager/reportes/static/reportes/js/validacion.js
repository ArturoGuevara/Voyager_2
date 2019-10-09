const regexNumber = /[0-9]{1}/;

$(document).ready(function(){
   $("#dhl_code").on("keypress", justNumbers);
});

function justNumbers(e){
   return regexNumber.test(e.originalEvent.key);
}