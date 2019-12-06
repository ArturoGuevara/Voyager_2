import csv
from reportes.models import Analisis,Pais
# mx-holanda_precios.csv
# test_file.csv

class Uploader():


    def show_content(file_name):        # Despliega el codigo de todos los analisis
        with open(file_name, mode='r', encoding="utf8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:  # Por cada registro en el csv
                line_count += 1
                codigo = row["﻿CODIGO"]
                nombre = row["NOMBRE"]
                descripcion = row["DESCRIPCION"]
                precio = row["PRECIO"]
                unidad_min = row["UNIDAD_MIN"]
                dias = row["DIAS"]
                acreditacion = row["ACREDITACION"]
                print(f'{codigo} \t| {nombre} \t| {descripcion} \t| ${precio} \t| {unidad_min} \t| {dias} \t| {acreditacion}')
            print(f'Registros: {line_count}')


    def validate_content(file_name):  # Valida los campos del csv
        paises = {
            'México' : Pais.objects.get(nombre="México"),
            'Holanda' : Pais.objects.get(nombre="Holanda"),
            'Alemania' : Pais.objects.get(nombre="Alemania"),
            'Estados Unidos' : Pais.objects.get(nombre="Estados Unidos"),
            'Canadá' : Pais.objects.get(nombre="Canadá"),
            'IFC' : Pais.objects.get(nombre="IFC"),
            'IFC' : Pais.objects.get(nombre="IFC"),
            'IFC' : Pais.objects.get(nombre="IFC"),
        }
        with open(file_name, mode='r', encoding="ISO-8859-1") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            error_log = []

            for row in csv_reader:
                error_flag = True
                line_count += 1
                print('Evaluando: '+row["codigo"]+' ... ', end='')

                codigo = row["codigo"] #
                nombre = row["nombre"] #
                descripcion = row["descripcion"] #
                precio = row["precio"] #
                unidad_min = row["unidad_min"] #
                dias = row["tiempo"] #
                acreditacion_t = row["acreditacion"]


                if len(codigo) > 52 or len(codigo) <= 0:        # Validar el campo de CODIGO
                    error_flag = False
                    print('Falla el codigo! | ', end='')

                if len(nombre) > 102:       # Validar el campo de NOMBRE
                    error_flag = False
                    print('Falla el nombre! '+str(len(nombre))+' lineas | ', end='')

                if len(descripcion) > 502: # Validar el campo de DESCRIPCION
                    error_flag = False
                    print('Falla descripcion! |', end='')

                try:    # Validar el campo de PRECIO
                    val = float(precio)
                except ValueError:
                    error_flag = False
                    print('Falla el precio! | ', end='')

                if len(unidad_min) > 52:                            # Validar el campo de UNIDAD_MIN
                    error_flag = False
                    print('Falla unidad_min! |', end='')

                if len(dias) > 17:           # Validar el campo de DIAS
                    error_flag = False
                    print('Falla dias! |', end='')

                if acreditacion_t == 'True' or acreditacion_t == 'False':   # Valida el campo de ACREDITACION
                    print("", end='')
                else:
                    error_flag =  False
                    print('Falla acreditacion! | ', end='')

                if not error_flag:
                    print("")
                    error_log.append("Registro "+str(line_count)+": "+codigo)
                else:
                    print("PASÓ")

            print("\n\nEVALUACIÓN FINALIZADA\n\n")
            if len(error_log) == 0:
                print("Han pasado todos los registros con exito")
            else:
                print("Se encontraron "+str(len(error_log))+" errores de formato:")
                for e in error_log:
                    print(e)
            return error_log


    def upload_content(file_name):  # Sube todo el contenido del csv a la base de datos
        paises = {
            'México' : Pais.objects.get(nombre="México"),
            'Holanda' : Pais.objects.get(nombre="Holanda"),
            'Alemania' : Pais.objects.get(nombre="Alemania"),
            'Estados Unidos' : Pais.objects.get(nombre="Estados Unidos"),
            'Canadá' : Pais.objects.get(nombre="Canadá"),
            'IFC' : Pais.objects.get(nombre="IFC"),
            'IFC' : Pais.objects.get(nombre="IFC"),
            'IFC' : Pais.objects.get(nombre="IFC"),
        }
        with open(file_name, mode='r', encoding="ISO-8859-1") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:
                print('Subiendo: '+row["codigo"]+' ... ', end='')
                line_count += 1
                codigo = row["codigo"] #
                nombre = row["nombre"] #
                descripcion = row["descripcion"] #
                precio = row["precio"] #
                unidad_min = row["unidad_min"] #
                dias = row["tiempo"] #
                acreditacion_t = row["acreditacion"]
                p = paises[row["pais_id"]]   # Se obtiene el país del diccionario

                acred = False
                if acreditacion_t == 'True':  # Se valida la acreditacion
                    acred = True

                n_dias = dias + " días"

                a = Analisis(              # Se crea el registro
                        nombre=nombre,
                        codigo=codigo,
                        descripcion=descripcion,
                        precio=precio,
                        unidad_min=unidad_min,
                        tiempo=n_dias,
                        pais=p,
                        acreditacion=acred
                        )
                a.save()                # Se guarda el registro
                print('GUARDADO')
            print("\n\nFINALIZADO\n\n")
