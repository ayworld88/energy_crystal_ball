
import csv, json

csvFilePath = "file.csv"
jsonFilePath = "file.json"

#read the csv and add the data to a dictionary

data = {}
with open('Texas_Energy.csv') as csvFile:
    csvReader = csv.DictReader(csvFile)
    for csvRow in csvReader:
        Years = csvRow["Years"]
        data[Years] = csvRow

# print(data)

# write the data toa json file
with open('T_data.json', "w") as jsonFile:
    jsonFile.write(json.dumps(data, indent = 4))