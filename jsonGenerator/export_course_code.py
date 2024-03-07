import json
f = open('./allCourses.json')
data = json.load(f)
def exportMods(json_data):
    file_name = "courseNames.json"
    names = [item['code'] for item in json_data]

    with open(file_name, 'w') as outfile:
        json.dump(names, outfile)
        print('Data exported to', file_name)

exportMods(data)