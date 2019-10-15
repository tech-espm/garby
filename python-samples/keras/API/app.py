from flask import Flask, request, jsonify, send_from_directory
import random
from predicao import predict
import json

app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route('/')
def hello():
    return '''<h4 style="color: green">Welcome to the Garby prediction API, this is not intended to be seen by end users, but I am glad you are here <3</h4>'''

@app.route('/predict', methods=['POST'])
def predictResponse():
    # jason = request.get_json()
    # basers = jason['base']
    # print(predict(basers))
    resp = random.randint(0, 5)
    resp = jsonify(materialType = resp)
    return resp





# {"base": "base64"}