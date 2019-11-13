import csv
from reportes.models import Analisis,Pais
# mx-holanda_precios.csv
# test_file.csv

class Uploader():

    def show_content(file_name):        # Despliega el codigo de todos los analisis
        with open(file_name, mode='r', encoding="utf8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            char_count = 0
            nombre_count = 0
            flag = True
            for row in csv_reader:  # Por cada registro en el csv
                if line_count == 0:
                    line_count += 1
                for c in row["DESCRIPCION"]:    # Por cada caracter en el campo de descripcion
                    try:
                        next_char = row["DESCRIPCION"][char_count+1]
                    except:
                        next_char = 1
                    char_count += 1
                    if c == '-' and flag and next_char == '-':
                        nombre_count = char_count
                        flag = False

                if not flag:
                    nombre = row["DESCRIPCION"][0:nombre_count-1]
                    descripcion = row["DESCRIPCION"][nombre_count+1:char_count]
                else:
                    nombre = ' - '
                    descripcion = row["DESCRIPCION"]



                char_count = 0
                nombre_count = 0
                flag = True
                #print(f'{row["﻿CODIGO"]} \t {nombre} \t {descripcion} \t {row["PRECIO"]} \t {row["UNIDAD_MIN"]} \t {row["DIAS"]} \t {row["NOTAS"]} \t {row["ACREDITACION"]} \t {row["PAIS"]}')
                print("Code: "+row["﻿CODIGO"]+"\tNombre: "+nombre+"\tDescripcion: "+descripcion)
                line_count += 1
            print(f'Registros: {line_count-1}')

    def upload_content(file_name):  # Sube todo el contenido del csv a la base de datos
        paises = {
            'M' : Pais.objects.get(nombre="México"),
            'H' : Pais.objects.get(nombre="Holanda"),
            'G' : Pais.objects.get(nombre="Alemania"),
            'U' : Pais.objects.get(nombre="Estados Unidos"),
            'C' : Pais.objects.get(nombre="Canadá"),
            'I' : Pais.objects.get(nombre="IFC"),
            'O' : Pais.objects.get(nombre="IFC"),
            'A' : Pais.objects.get(nombre="IFC"),
        }
        with open(file_name, mode='r', encoding="utf8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            char_count = 0
            nombre_count = 0
            flag = True
            for row in csv_reader:
                print('Subiendo: '+row["﻿CODIGO"]+' ... ', end='')
                if line_count == 0:
                    line_count += 1
                line_count += 1
                for c in row["DESCRIPCION"]:    # Por cada caracter en el campo de descripcion
                    char_count += 1
                    if c == '-' and flag:       # Se busca el indice del arreglo donde está el primer guión
                        nombre_count = char_count
                        flag = False
                nombre = row["DESCRIPCION"][0:nombre_count-1]                   # Se divide el nombre de la descripcion
                descripcion = row["DESCRIPCION"][nombre_count+2:char_count]

                char_count = 0
                nombre_count = 0
                flag = True

                p = paises[row["﻿CODIGO"][0]]   # Se obtiene el país del diccionario

                acred = False
                if row["ACREDITACION"] == 'Q':  # Se valida la acreditacion
                    acred = True

                precio = row["PRECIO"]  # Si no tiene precio, se colocará un -1
                if precio == '':
                    precio = -1

                dias = row["DIAS"] + " días"    # Se depura si en la columna no está el formato (# - #)
                if len(dias) > 10:
                    dias = ' - '
                if dias == '':
                    dias = ' - '


                if row["﻿CODIGO"][0] != "I":    # Se depuran todos los registros de insumos
                    a = Analisis(              # Se crea el registro
                            nombre=nombre,
                            codigo=row["﻿CODIGO"],
                            descripcion=descripcion,
                            precio=precio,
                            unidad_min=row["UNIDAD_MIN"],
                            tiempo=dias,
                            pais=p,
                            acreditacion=acred
                            )
                    a.save()                # Se guarda el registro
                    print(f'{row["﻿CODIGO"]} registrado exitosamente')
                else:
                    print('Insumo detectado... '+row["﻿CODIGO"]+' DEPURADO')




            print("\n\nFINALIZADO\n\n")
