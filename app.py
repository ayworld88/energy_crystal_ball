from flask import Flask, render_template, jsonify
import tablib
import os
import json

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("index.html")




 

dataset = tablib.Dataset()
with open(os.path.join('data', 'csv', 'Texas_Energy.csv')) as f:
    dataset.csv = f.read()
 
@app.route("/data1")
def index():    
    return dataset.csv   
 
dataset2 = tablib.Dataset()
with open(os.path.join('data', 'csv', 'Texas_Energy2.csv')) as f:
    dataset2.csv = f.read()
 
@app.route("/data2")
def index2():    
    return dataset2.csv

dataset3 = tablib.Dataset()
with open(os.path.join('data', 'csv', 'Cali_Energy.csv')) as f:
    dataset3.csv = f.read()
 
@app.route("/data3")
def index3():    
    return dataset3.csv   
 
dataset4 = tablib.Dataset()
with open(os.path.join('data', 'csv', 'Cali_cleaned.csv')) as f:
    dataset4.csv = f.read()
 
@app.route("/data4")
def index4():    
    return dataset4.csv


dataset5 = tablib.Dataset()
with open(os.path.join('data', 'csv', 'big_picture.csv')) as f:
    dataset5.csv = f.read()
 
@app.route("/data5")
def index5():    
    return dataset5.csv

with open('data/TC_states.json') as jsonfile:
    TC_json = json.load(jsonfile)


@app.route('/jsonfile')
def jsonfile():
    return jsonify(TC_json)
    




if __name__ == '__main__':
    app.run()