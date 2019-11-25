import csv
from reportes.models import Analisis,Pais
# mx-holanda_precios.csv
# test_file.csv

class Uploader():


    def show_content(self, file_name, self):        # Despliega el codigo de todos los analisis
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


    def validate_content(self, file_name):  # Valida los campos del csv
        with open(file_name, mode='r', encoding="utf8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            error_log = []

            for row in csv_reader:
                error_flag = True
                line_count += 1
                print('Evaluando: '+row["﻿CODIGO"]+' ... ', end='')

                codigo = row["﻿CODIGO"] #
                nombre = row["NOMBRE"] #
                descripcion = row["DESCRIPCION"] #
                precio = row["PRECIO"] #
                unidad_min = row["UNIDAD_MIN"] #
                dias = row["DIAS"] #
                acreditacion_t = row["ACREDITACION"]


                if len(codigo) > 50 or len(codigo) <= 0:        # Validar el campo de CODIGO
                    error_flag = False

                if len(nombre) > 100 or len(nombre) <= 0:       # Validar el campo de NOMBRE
                    error_flag = False

                if len(descripcion) > 500 or len(descripcion) <= 0: # Validar el campo de DESCRIPCION
                    error_flag = False

                try:    # Validar el campo de PRECIO
                    val = float(precio)
                except ValueError:
                    error_flag = False

                if len(unidad_min) > 50:                            # Validar el campo de UNIDAD_MIN
                    error_flag = False

                if dias.find('-') == -1 or len(dias) > 5:           # Validar el campo de DIAS
                    error_flag = False

                if acreditacion_t == 'Q' or acreditacion_t == '':   # Valida el campo de ACREDITACION
                    print("", end='')
                else:
                    error_flag =  False

                if not error_flag:
                    print("X")
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


    def upload_content(self, file_name):  # Sube todo el contenido del csv a la base de datos
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
                print('Subiendo: '+row["﻿CODIGO"]+' ... ', end='')
                line_count += 1
                codigo = row["﻿CODIGO"] #
                nombre = row["NOMBRE"] #
                descripcion = row["DESCRIPCION"] #
                precio = row["PRECIO"] #
                unidad_min = row["UNIDAD_MIN"] #
                dias = row["DIAS"] #
                acreditacion_t = row["ACREDITACION"]
                p = paises[row["﻿CODIGO"][0]]   # Se obtiene el país del diccionario

                acred = False
                if acreditacion_t == 'Q':  # Se valida la acreditacion
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
