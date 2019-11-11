import csv
from reportes.models import Analisis,Pais
# mx-holanda_precios.csv
# test_file.csv

class Uploader():

    def show_content(file_name):        # Despliega el codigo de todos los analisis
        with open(file_name, mode='r', encoding="utf8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    line_count += 1
                print(f'{row["﻿CODIGO"]} \t {row["NOMBRE"]} \t {row["DESCRIPCION"]} \t {row["PRECIO"]} \t {row["UNIDAD_MIN"]} \t {row["DIAS"]} \t {row["NOTAS"]} \t {row["ACREDITACION"]} \t {row["PAIS"]}')
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
            for row in csv_reader:
                if line_count == 0:
                    line_count += 1
                line_count += 1

                p = paises[row["﻿CODIGO"][0]]

                acred = False
                if row["ACREDITACION"] == 'Q':
                    acred = True

                precio = row["PRECIO"]
                if precio == '':
                    precio = -1

                dias = row["DIAS"] + " días"
                if len(dias) > 10:
                    dias = ' - '
                if dias == '':
                    dias = ' - '


                if row["CODIGO"][0] != "I":
                    a = Analisis(
                            nombre=row["NOMBRE"],
                            codigo=row["﻿CODIGO"],
                            descripcion=row["DESCRIPCION"],
                            precio=precio,
                            unidad_min=row["UNIDAD_MIN"],
                            tiempo=dias,
                            pais=p,
                            acreditacion=acred
                            )
                    a.save()
                    print(f'{row["﻿CODIGO"]} registrado exitosamente')

    


            print("\n\nFINALIZADO\n\n")
