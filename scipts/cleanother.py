import json
from pathlib import Path

po = json.load(Path('pythonout.json').open())

po = [x for x in po if x['id'] and x['code']]

json.dump(po, Path('pythonout2.json').open('w'))