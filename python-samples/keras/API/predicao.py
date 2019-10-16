import numpy as np
import pandas as pd
from keras import backend as K
from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img, array_to_img
import base64
import random, os, glob
import matplotlib.pyplot as plt



def predict(baseString):
    model = load_model('../trained_model_79_Cesar.h5')
    model.compile(loss='categorical_crossentropy', optimizer = 'adam', metrics = ['acc'])
    img = load_img(convertIMG(baseString), target_size=(200, 200))
    img_array = np.expand_dims(img_to_array(img), axis=0)
    images = np.vstack([img_array])
    classes = model.predict_classes(images, batch_size = 10)
    K.clear_session()
    return str(classes[0])





def convertIMG(baseString):
    imgdata = base64.urlsafe_b64decode(baseString)
    filename = 'temporary.jpg'
    with open(filename, 'wb') as f:
        f.write(imgdata)
    return filename
