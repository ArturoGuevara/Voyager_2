function importar_csv(){
  var file_r = ('#csv_analisis');
  if(check_is_not_empty(file_r,'#csv_analisis')){
    document.getElementById("submit_csv_form").submit();
  }
}

function validar_csv(){

  if( document.getElementById("csv_analisis").files.length == 0 ){
      
  }else{
    importar_csv()
  }
}
