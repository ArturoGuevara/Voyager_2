var cnt_ingreso_agricola = 1;
var cnt_ingreso_procesado = 1;
var cnt_ingreso_microbiologia = 1;

var opcionesAnalisis = '';
for(var i = 0; i < analisis.length ;i++){
    opcionesAnalisis+='<option value="'+analisis[i][0]+'">'+analisis[i][1]+'</option>';
}
var retro = '</select><div class="invalid-feedback">Seleccione un análisis</div></td>';
var retro2 = '</select></td>';

function validar_info_solicitante() {
    var dict = {
        1: check_is_not_empty($('#nombre').val(), '#nombre'),
        2: check_is_not_empty($('#direccion').val(), '#direccion'),
        3: check_is_not_empty($('#pais').val(), '#pais'),
        4: check_is_not_empty($('#idioma').val(), '#idioma'),
    }
    for (var key in dict) {
        var value = dict[key];
        var flag = true;
        if (value == false) {
            flag = false
            break;
        }
    }
    if (flag == true) {
        continuar_parte_muestras();
    }
}
function regresar_parte_solicitante(){
    // Alternar headers
    $('#title-2').removeClass('d-block').addClass('d-none');
    $('#title-1').removeClass('d-none').addClass('d-block');
    
    // Alternar botones
    $('#btn-muestra-continuar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-regresar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-guardar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-enviar').removeClass('d-inline').addClass('d-none');
    
    // Alternar contenedores
    $('#info-solicitante').addClass('d-block').removeClass('d-none');
    $('#info-muestras').removeClass('d-block').addClass('d-none');
}
function continuar_parte_muestras(){
    // Alternar headers
    $('#title-1').removeClass('d-block').addClass('d-none');
    $('#title-2').removeClass('d-none').addClass('d-block');
    
    // Alternar botones
    $('#btn-muestra-continuar').removeClass('d-inline').addClass('d-none');
    $('#btn-muestra-regresar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-guardar').addClass('d-inline').removeClass('d-none');
    $('#btn-muestra-enviar').addClass('d-inline').removeClass('d-none');
    
    // Alternar contenedores
    $('#info-solicitante').removeClass('d-block').addClass('d-none');
    $('#info-muestras').addClass('d-block').removeClass('d-none');
}
$('.btn-plantilla').click(function(){
    // Obtenemos el target del contenedor que se tiene que desplegar
    var target = $(this).data('target');
    // Si ha sido clickeado antes, escondemos todos los contenedores
    if($(this).hasClass('clicked')){
        $(this).removeClass('clicked');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoProcesado').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else{ // Si es la primera vez que se clickea, le agregamos la clase nada más
        $(this).addClass('clicked');
    }
    if(target === 'agricola'){
        $('#containerProductoAgricola').collapse('show');
        $('#containerProductoProcesado').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else if(target === 'procesado'){
        $('#containerProductoProcesado').collapse('show');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoMicrobiologia').collapse('hide');
    }else if(target === 'microbiologia'){
        $('#containerProductoMicrobiologia').collapse('show');
        $('#containerProductoAgricola').collapse('hide');
        $('#containerProductoProcesado').collapse('hide');
    }
});

/* FUNCIONES PARA AGREGAR Y QUITAR FILAS A CADA FORMATO */
function agregar_fila_agricola(){
    $('#tabla-agricola-body').append('<tr class="fila-tabla-agricola" data-id="'+cnt_ingreso_agricola+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="productoAG-'+cnt_ingreso_agricola+'" name="productoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="variedadAG-'+cnt_ingreso_agricola+'" name="variedadAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-origenAG-'+cnt_ingreso_agricola+'" name="paisOrigenAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-muestraAG-'+cnt_ingreso_agricola+'" name="codigoMuestraAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="proveedorAG-'+cnt_ingreso_agricola+'" name="proveedorAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="codigo-trazabilidadAG-'+cnt_ingreso_agricola+'" name="codigoTrazabilidadAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="agricultorAG-'+cnt_ingreso_agricola+'" name="agricultorAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="direccionAG-'+cnt_ingreso_agricola+'" name="direccionAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="parcelaAG-'+cnt_ingreso_agricola+'" name="parcelaAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="ubicacion-muestreoAG-'+cnt_ingreso_agricola+'" name="ubicacionMuestreoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_agricola+'" id="fecha-muestreoAG-'+cnt_ingreso_agricola+'" name="fechaMuestreoAG[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="urgenteAG-'+cnt_ingreso_agricola+'" name="urgenteAG[]"><option value="Sí">Sí</option><option value="No">No</option></select>'+retro+'</td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="muestreadorAG-'+cnt_ingreso_agricola+'" name="muestreadorAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_agricola+'" id="pais-destinoAG-'+cnt_ingreso_agricola+'" name="paisDestinoAG[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="primer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis1AG[]">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="segundo-analisisAG-'+cnt_ingreso_agricola+'" name="analisis2AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="tercer-analisisAG-'+cnt_ingreso_agricola+'" name="analisis3AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="cuarto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis4AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="quinto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis5AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_agricola+'" id="sexto-analisisAG-'+cnt_ingreso_agricola+'" name="analisis6AG[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_agricola('+cnt_ingreso_agricola+')"><i class="fa fa-trash"></i></button></td></tr>');

    cnt_ingreso_agricola+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}
function quitar_fila_agricola(id){
    $('.fila-tabla-agricola').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}

function agregar_fila_procesado(){
    $('#tabla-procesado-body').append('<tr class="fila-tabla-procesado" data-id="'+cnt_ingreso_procesado+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="tipo-muestraPR-'+cnt_ingreso_procesado+'" name="tipoMuestraPR[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_procesado+'" id="descripcion-muestraPR-'+cnt_ingreso_procesado+'" name="descripcionMuestraPR[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_procesado+'" id="fecha-muestreoPR-'+cnt_ingreso_procesado+'" name="fechaMuestreoPR[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="primer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis1PR[]">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="segundo-analisisPR-'+cnt_ingreso_procesado+'" name="analisis2PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="tercer-analisisPR-'+cnt_ingreso_procesado+'" name="analisis3PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="cuarto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis4PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="quinto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis5PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_procesado+'" id="sexto-analisisPR-'+cnt_ingreso_procesado+'" name="analisis6PR[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_procesado('+cnt_ingreso_procesado+')"><i class="fa fa-trash"></i></button></td></tr>');
    
    cnt_ingreso_procesado+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}
function quitar_fila_procesado(id){
    $('.fila-tabla-procesado').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}

function agregar_fila_micro(){    
    $('#tabla-microbiologia-body').append('<tr class="fila-tabla-micro" data-id="'+cnt_ingreso_microbiologia+'"><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="tipo-muestraMB-'+cnt_ingreso_microbiologia+'" name="tipoMuestraMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="lote-codigoMB-'+cnt_ingreso_microbiologia+'" name="loteCodigoMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="muestreadorMB-'+cnt_ingreso_microbiologia+'" name="muestreadorMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><input type="text" class="form-control datepicker" data-id="'+cnt_ingreso_microbiologia+'" id="fecha-muestreoMB-'+cnt_ingreso_microbiologia+'" name="fechaMuestreoMB[]"><div class="invalid-feedback">Ingrese fecha con el formato mm/dd/yyyy</div></td><td><input type="text" class="form-control" data-id="'+cnt_ingreso_microbiologia+'" id="metodo-referenciaMB-'+cnt_ingreso_microbiologia+'" name="metodoReferenciaMB[]"><div class="invalid-feedback">Ingrese texto sin comas</div></td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="primer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis1MB[]">'+opcionesAnalisis+'</select>'+retro+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="segundo-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis2MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="tercer-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis3MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="cuarto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis4MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="quinto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis5MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><select class="custom-select" data-id="'+cnt_ingreso_microbiologia+'" id="sexto-analisisMB-'+cnt_ingreso_microbiologia+'" name="analisis6MB[]"><option value="-1" selected>Ninguno</option>'+opcionesAnalisis+'</select>'+retro2+'</td><td><button type="button" class="btn btn-danger" onclick="quitar_fila_micro('+cnt_ingreso_microbiologia+')"><i class="fa fa-trash"></i></button></td></tr>');
    
    cnt_ingreso_microbiologia+=1;
    // El datepicker que se agrega activarlo
    $(".datepicker" ).datepicker();
}
function quitar_fila_micro(id){
    $('.fila-tabla-micro').each(function(){
        if(id == $(this).data('id')){
            $(this).remove();
        }
    });
}

/* FUNCIONES PARA VALIDAR LOS CAMPOS DE CADA FORMATO */
function validar_ingreso_muestra(){
    var v1 = validar_producto_procesado();
    var v2 = validar_producto_microbiologia();
    var v3 = validar_producto_agricola();
    if (v1 == "vacío" && v2 == "vacío" && v3 == "vacío"){ //Si las tres funciones regresaron "vacío" significa que no se agregó ninguna muestra
        showNotification('top','right','Por favor, ingrese una muestra');
    }else if(v1 == false || v2 == false || v3 == false){//Si una sola es false, significa que un input está vacío o incorrecto
        showNotification('top','right','Por favor, revise sus datos');
    }else{
        $('#envio_orden').modal('show');
    }
}
function validar_producto_agricola(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacío"
    var v;
    $("input[name='productoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#productoAG-'+id);
        flag = v;
    });
    $("input[name='variedadAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#variedadAG-'+id);
        flag = flag && v;
    });
    $("input[name='paisOrigenAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#pais-origenAG-'+id);
        flag = flag && v;
    });
    $("input[name='codigoMuestraAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#codigo-muestraAG-'+id);
        flag = flag && v;
    });
    $("input[name='proveedorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#proveedorAG-'+id);
        flag = flag && v;
    });
    $("input[name='codigoTrazabilidadAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#codigo-trazabilidadAG-'+id);
        flag = flag && v;
    });
    $("input[name='agricultorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#agricultorAG-'+id);
        flag = flag && v;
    });
    $("input[name='direccionAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#direccionAG-'+id);
        flag = flag && v;
    });
    $("input[name='parcelaAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#parcelaAG-'+id);
        flag = flag && v;
    });
    $("input[name='ubicacionMuestreoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#ubicacion-muestreoAG-'+id);
        flag = flag && v;
    });
    $("input[name='urgenteAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#urgenteAG-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoAG-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoAG-'+id);
        flag = flag && v;
    });
    $("input[name='muestreadorAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#muestreadorAG-'+id);
        flag = flag && v;
    });
    $("input[name='paisDestinoAG[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#pais-destinoAG-'+id);
        flag = flag && v;
    });
    return flag;
}
function validar_producto_procesado(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacío"
    var v;
    $("input[name='tipoMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#tipo-muestraPR-'+id);
        flag = v;
    });
    $("input[name='descripcionMuestraPR[]']").each(function(){
        var id = $(this).data('id');
        v =check_not_commas_empty($(this).val(),'#descripcion-muestraPR-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoPR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoPR-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoPR-'+id);
        flag = flag && v;
    });
    $("select[name='analisis1PR[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#primer-analisisPR-'+id);
        flag = flag && v;
    });
    return flag;
}
function validar_producto_microbiologia(){// Validamos los arreglos de inputs
    var flag = "vacío"; //Esta bandera se hará false con un solo campo que no cumpla el formato, si no encuentra ningún campo, permanecerá como "vacio"
    var v;
    $("input[name='tipoMuestraMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#tipo-muestraMB-'+id);
        flag = v;
    });
    $("input[name='loteCodigoMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#lote-codigoMB-'+id);
        flag = flag && v;
    });
    $("input[name='fechaMuestreoMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#fecha-muestreoMB-'+id);
        flag = flag && v;
        v = date_is_valid($(this).val(),'#fecha-muestreoMB-'+id);
        flag = flag && v;
    });
    $("input[name='muestreadorMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#muestreadorMB-'+id);
        flag = flag && v;
    });
    $("select[name='analisis1MB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#primer-analisisMB-'+id);
        flag = flag && v;
    });
    $("input[name='metodoReferenciaMB[]']").each(function(){
        var id = $(this).data('id');
        v = check_not_commas_empty($(this).val(),'#metodo-referenciaMB-'+id);
        flag = flag && v;
    });
    return flag;
}

function enviar_ingreso_muestra(){
    // Obtener valor de los inputs
    var nombre = $('#nombre').val();
    var direccion = $('#direccion').val();
    var pais = $('#pais').val();
    var estado = $('#estado').val();
    var idioma = $('#idioma').val();
    
    // Información de formato agrícola (19 arreglos)
    var matrixAG = []
    var productoAG = iterar_input("productoAG","input");
    var variedadAG = iterar_input("variedadAG","input");
    var paisOrigenAG = iterar_input("paisOrigenAG","input");
    var codigoMuestraAG = iterar_input("codigoMuestraAG","input");
    var proveedorAG = iterar_input("proveedorAG","input");
    var codigoTrazabilidadAG = iterar_input("codigoTrazabilidadAG","input");
    var agricultorAG = iterar_input("agricultorAG","input");
    var direccionAG = iterar_input("direccionAG","input");
    var parcelaAG = iterar_input("parcelaAG","input");
    var ubicacionMuestreoAG = iterar_input("ubicacionMuestreoAG","input");
    var fechaMuestreoAG = iterar_input("fechaMuestreoAG","input");
    var urgenteAG = iterar_input("urgenteAG","select");
    var muestreadorAG = iterar_input("muestreadorAG","input");
    var paisDestinoAG = iterar_input("paisDestinoAG","input");
    var analisis1AG = iterar_input("analisis1AG","select");
    var analisis2AG = iterar_input("analisis2AG","select");
    var analisis3AG = iterar_input("analisis3AG","select");
    var analisis4AG = iterar_input("analisis4AG","select");
    var analisis5AG = iterar_input("analisis5AG","select");
    var analisis6AG = iterar_input("analisis6AG","select");
    // Guardamos los arreglos en otro arreglo
    matrixAG.push(productoAG);matrixAG.push(variedadAG);
    matrixAG.push(paisOrigenAG);matrixAG.push(codigoMuestraAG);
    matrixAG.push(proveedorAG);matrixAG.push(codigoTrazabilidadAG);
    matrixAG.push(agricultorAG);matrixAG.push(direccionAG);
    matrixAG.push(parcelaAG);matrixAG.push(ubicacionMuestreoAG);
    matrixAG.push(fechaMuestreoAG);matrixAG.push(urgenteAG);
    matrixAG.push(muestreadorAG);matrixAG.push(paisDestinoAG);
    matrixAG.push(analisis1AG);matrixAG.push(analisis2AG);matrixAG.push(analisis3AG);
    matrixAG.push(analisis4AG);matrixAG.push(analisis5AG);matrixAG.push(analisis6AG);
    
    // Información de formato de producto procesado (8 arreglos)
    var matrixPR = [];
    var tipoMuestraPR = iterar_input("tipoMuestraPR","input");
    var descripcionMuestraPR = iterar_input("descripcionMuestraPR","input");
    var fechaMuestreoPR = iterar_input("fechaMuestreoPR","input");
    var analisis1PR = iterar_input("analisis1PR","select");
    var analisis2PR = iterar_input("analisis2PR","select");
    var analisis3PR = iterar_input("analisis3PR","select");
    var analisis4PR = iterar_input("analisis4PR","select");
    var analisis5PR = iterar_input("analisis5PR","select");
    var analisis6PR = iterar_input("analisis6PR","select");
    // Guardamos los arreglos en otro arreglo
    matrixPR.push(tipoMuestraPR);
    matrixPR.push(descripcionMuestraPR);
    matrixPR.push(fechaMuestreoPR);
    matrixPR.push(analisis1PR);matrixPR.push(analisis2PR);matrixPR.push(analisis3PR);
    matrixPR.push(analisis4PR);matrixPR.push(analisis5PR);matrixPR.push(analisis6PR);
        
    // Información de formato de microbiología (10 arreglos)
    var matrixMB = [];
    var tipoMuestraMB = iterar_input("tipoMuestraMB","input");
    var loteCodigoMB = iterar_input("loteCodigoMB","input");
    var muestreadorMB = iterar_input("muestreadorMB","input");
    var fechaMuestreoMB = iterar_input("fechaMuestreoMB","input");
    var metodoReferenciaMB = iterar_input("metodoReferenciaMB","input");
    var analisis1MB = iterar_input("analisis1MB","select");
    var analisis2MB = iterar_input("analisis2MB","select");
    var analisis3MB = iterar_input("analisis3MB","select");
    var analisis4MB = iterar_input("analisis4MB","select");
    var analisis5MB = iterar_input("analisis5MB","select");
    var analisis6MB = iterar_input("analisis6MB","select");
    // Guardamos los arreglos en otro arreglo
    matrixMB.push(tipoMuestraMB);matrixMB.push(loteCodigoMB);matrixMB.push(muestreadorMB);
    matrixMB.push(fechaMuestreoMB);matrixMB.push(metodoReferenciaMB);
    matrixMB.push(analisis1MB);matrixMB.push(analisis2MB);matrixMB.push(analisis3MB);
    matrixMB.push(analisis4MB);matrixMB.push(analisis5MB);matrixMB.push(analisis6MB);
    
    // Obtenemos el token de django para el ajax
    var token = csrftoken;
    
    $.ajax({
        url: "registrar_ingreso_muestra",
        dataType: 'json',
        // Seleccionar información que se mandara al controlador
        data: {
            'csrfmiddlewaretoken': token,
            nombre: nombre,
            direccion: direccion,
            pais: pais,
            estado: estado,
            idioma: idioma,
            'matrixAG[]': matrixAG,
            'matrixPR[]': matrixPR,
            'matrixMB[]': matrixMB
        },
        type: "POST",
        success: function (response) {
            $('#envio_orden').modal('hide'); //Cierra el modal que pide confirmación
            showNotification('top','right','Se han registrado sus muestras exitosamente.');//Mostrar notificación de envío exitoso
            $('#ingreso-cliente-form').remove();
            $('#opciones_guardado').remove();
            window.setTimeout( function(){
                window.location='ingreso_cliente'
            }, 3000 ); //Tras unos segundos, recargar la página
        },
        error: function (data) {
            $('#envio_orden').modal('hide'); //Cierra el modal que pide confirmación
            showNotification('top','right','Ha ocurrido un error. Inténtelo de nuevo más tarde.');//Mostrar notificación de envío exitoso
        }
    });
}

function iterar_input(name, type){
    var aux = [];
    $(type+"[name='"+name+"[]']").each(function () {
        aux.push($(this).val());
    });
    return aux;
}