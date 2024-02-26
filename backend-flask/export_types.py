import json

# Opening JSON file
f = open('modPrograms.json')
data = json.load(f)

def exportTypes(json_data):
    file_majors = "allMajors.json"
    file_minors = "allMinors.json"
    # Filter data based on key 'type' and its value 'major'
    majors = [item for item in json_data if item['type'] == 'Major']
    minors = [item for item in json_data if item['type'] == 'Minor']
    
    # Write filtered data to JSON file
    with open(file_majors, 'w') as outfile:
        json.dump(majors, outfile)
        print('Data exported to', file_majors)
    
    with open(file_minors, 'w') as outfile:
        json.dump(minors, outfile)
        print('Data exported to', file_minors)

exportTypes(data)