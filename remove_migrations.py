import os
from os import listdir
import shutil

all_paths = [
	'voyager/cuentas/migrations/',
	'voyager/ventas/migrations/',
	'voyager/root/migrations/',
	'voyager/tracking/migrations/',
	'voyager/reportes/migrations/',
]

for path in all_paths:
	for file in listdir(path):
		if not file.endswith("__init__.py") and not file.endswith("__pycache__"):
			print(path + file)
			os.remove(path + file)
	for file in listdir(path + '__pycache__/'):
		print(path + '__pycache__/' + file)
		os.remove(path + '__pycache__/' + file)