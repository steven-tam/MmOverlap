import json
f = open('allPrograms.json')
data = json.load(f)
def exportMods(json_data):
    file_name = "programNames.json"
    names = [item['catalogDisplayName'] for item in json_data]

    with open(file_name, 'w') as outfile:
        json.dump(names, outfile)
        print('Data exported to', file_name)

exportMods(data)