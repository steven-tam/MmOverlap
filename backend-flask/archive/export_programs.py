import requests
import json

def export_dogs():
    url = 'https://app.coursedog.com/api/v1/cm/umn_umntc_peoplesoft/programs/'
    file_name = 'allPrograms.json'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        programs = [program for program in data['data'] if program]
       
        with open(file_name, 'w') as outfile:
            json.dump(programs, outfile)
            print('Data exported to', file_name)
    else:
        print('Error exporting data to JSON file', file_name)
        print('Status Code:', response.status_code)


export_dogs()