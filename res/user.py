import json
import os
path=os.path.join(r"mcpath","launcher_accounts.json")
with open(path,'r') as f:
    data=json.load(f)
    for acc in data['accounts']:
        data['accounts'][acc]['minecraftProfile']['name']='yourname'

with open(path,'w') as f:
    json.dump(data,f)