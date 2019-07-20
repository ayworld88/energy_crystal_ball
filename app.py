from flask import Flask, render_template, jsonify
import pandas as pd 


app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("index")

if __name__ == '__main__':
    app.run()