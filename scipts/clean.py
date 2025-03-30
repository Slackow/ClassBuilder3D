import json
import re
from pathlib import Path
obj = json.load(Path('outfile3.txt').open())

result = []
reg = re.compile(r'[A-Z]+ \d{3}')
for n in obj:
    if not reg.fullmatch(n['course_id']):
        print(n)

# json.dump(result, Path('outfile4.txt').open('w'))