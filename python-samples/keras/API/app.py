from flask import Flask, request
from prediction import predict
import json

app = Flask(__name__)


@app.route('/')
def hello():
    return '''<h4 style="color: green">Welcome to the Garby prediction API, this is not intended to be seen by end users, but I am glad you are here <3</h4>'''

@app.route('/predict', methods=['POST'])
def predictResponse():
    jason = json.loads(request.json)
    basers = jason['base']
    return predict(basers)





# {"base": "base64"}