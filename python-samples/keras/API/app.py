from flask import Flask, request, jsonify
import random
from predicao import predict
import json

app = Flask(__name__)


@app.route('/')
def hello():
    return '''<h4 style="color: green">Welcome to the Garby prediction API, this is not intended to be seen by end users, but I am glad you are here <3</h4>'''

@app.route('/predict', methods=['GET', 'POST'])
def predictResponse():
    # jason = request.get_json()
    # basers = jason['base']
    # print(predict(basers))
    return jsonify(random.randint(0, 5))





# {"base": "base64"}