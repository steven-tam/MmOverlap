import json
f = open('allPrograms.json')
data = json.load(f)
def exportMods(json_data):
    file_name = "modPrograms.json"
    filtered_data = []
    # List of keys you are interested in
    keys_of_interest = ["campus", "college", 'catalogDisplayName' ,'type', "customFields", "requisites"]

    new_list_of_dicts = [{key: item[key] for key in keys_of_interest} for item in json_data]
    onlyTC = [item for item in new_list_of_dicts if item['campus'] == 'Twin Cities'] # Filters for programs in the Twin Cities

    for item in onlyTC:
        filtered_item = item.copy() # Copies a program
        filtered_item['customFields'] = {key: item['customFields'].get(key) for key in ['programLevelCareer', "cdProgramDescr", "cdProgramCreditsProgramMax"]} # Filters customFields for desired keys  
        filtered_data.append(filtered_item)

    with open(file_name, 'w') as outfile:
        json.dump(filtered_data, outfile)
        print('Data exported to', file_name)

exportMods(data)