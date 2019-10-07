
import numpy as np
from keras.callbacks import ModelCheckpoint
from keras.layers import Conv2D, Flatten, MaxPooling2D, Dense, Dropout
from keras.models import Sequential
from keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img, array_to_img
import random, os, glob
import matplotlib.pyplot as plt

! unzip data

dir_path = "data/"

# - The glob module finds all the pathnames matching a specified pattern according to the rules used by the Unix shell
# - os implements some useful functions on pathnames. To read or write files see open(), and for accessing the filesystem see the os module. 
# The path parameters can be passed as either strings, or bytes. Applications are encouraged to represent file names as (Unicode) character strings
img_list = glob.glob(os.path.join(dir_path + '*/*.jpg'))

# Verificando tamanho da lista para bater com o total de fotos no dataset - 2527
print(len(img_list))
# Verificando tipos de variaveis 
print(type(img_list))
print(type(img_list[0]))
print(img_list[0])
# Portanto, nesse primeiro Array, capturamos somente o caminho até as imagens

# Generate batches of tensor image data with real-time data augmentation. The data will be looped over (in batches).
train = ImageDataGenerator(horizontal_flip = True, 
                           vertical_flip = True, 
                           validation_split = 0.1, 
                           rescale = 1./255, 
                           shear_range = 0.1, 
                           zoom_range = 0.1, 
                           width_shift_range = 0.1,
                           height_shift_range = 0.1
                          )
test = ImageDataGenerator(rescale = 1/255, validation_split = 0.1)
# Lovely flow_from_directory article! https://medium.com/@vijayabhaskar96/tutorial-image-classification-with-keras-flow-from-directory-and-generators-95f75ebe5720

train_generator = train.flow_from_directory(dir_path, color_mode = 'rgb', target_size = (200, 200), batch_size = 32, class_mode = 'categorical', subset='training')

test_generator = test.flow_from_directory(dir_path, target_size = (200, 200), color_mode = 'rgb', batch_size = 32, class_mode = 'categorical', subset='validation')

# Makes the classes Dictonary easier to handle
labels = (train_generator.class_indices)
labels = dict((v,k) for k,v in labels.items())

# artigo para entender melhor o que essas layer fazem
# https://machinelearningmastery.com/how-to-configure-the-number-of-layers-and-nodes-in-a-neural-network/
# Artigo sobre redes neurais aplicadas a imagens - Muito importante para entender nosso problema.
# https://towardsdatascience.com/a-comprehensive-guide-to-convolutional-neural-networks-the-eli5-way-3bd2b1164a53

model = Sequential()
# Input Layer
model.add(Conv2D(32, (3, 3), padding = 'same', input_shape = (200, 200, 3), activation = 'relu'))
# Hidden Layers
#   Convolutional
model.add(MaxPooling2D(pool_size = 2))
model.add(Conv2D(64, (3, 3), padding = 'same', activation = 'relu'))
model.add(MaxPooling2D(pool_size = 2))
model.add(Conv2D(32, (3, 3), padding = 'same', activation = 'relu'))
#   Classification
model.add(Flatten())
model.add(Dense(64, activation = 'relu'))
# Output Layer
model.add(Dense(6, activation = 'softmax'))

filepath = 'trained_model.h5'
checkpoint1 = ModelCheckpoint(filepath, monitor = 'val_acc', verbose = 1, save_best_only = True, mode = 'max')
callbacks_list = [checkpoint1]

# Sumário das diferentes camadas da rede neural e seus autputs
model.summary()

model.compile(loss='categorical_crossentropy', optimizer = 'adam', metrics = ['acc'])

model.fit_generator(train_generator, 
                    epochs = 100, 
                    steps_per_epoch = 2275//32, 
                    validation_data = test_generator,
                    validation_steps = 251//32,
                    callbacks = callbacks_list)

# The model has been trained and saved to the filesystem, now you need to load it and start making predictions with it

# Loading the Model
from keras.models import load_model
model = load_model('trained_model_8_Hlayers.h5')
model.compile(loss='categorical_crossentropy', optimizer = 'adam', metrics = ['acc'])

print("Cardboard = 0 | Glass = 1 | Metal = 2 | Paper = 3 | Plastic = 4 | Trash = 5")

# Predicting a single images
img = load_img('plastic800.jpg', target_size = (300, 300))
img_array = img_to_array(img)
img_array = np.expand_dims(img_array, axis = 0)

images = np.vstack([img_array])
classes = model.predict_classes(images, batch_size = 10)
print(classes)

img = load_img('plastic800.jpg')
img_arr = np.expand_dims(img_to_array(img), axis=0)
datagen = ImageDataGenerator(horizontal_flip = True, 
                           vertical_flip = True, 
                           validation_split = 0.1, 
                           rescale = 1./255, 
                           shear_range = 0.1, 
                           zoom_range = 0.1, 
                           width_shift_range = 0.1,
                           height_shift_range = 0.1
                          )

for batch in datagen.flow(img_arr, batch_size=1):
    print(batch[0][0][0])
    plt.imshow(batch[0])
    plt.show()
    break


