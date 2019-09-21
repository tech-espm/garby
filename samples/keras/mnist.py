import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf

# Definindo uma função para exibir amostra
def show_mnist(matrix, lin):
    size = matrix.shape[1]
    img = np.reshape(matrix[lin], (size, size))
    plt.imshow(img, cmap="gray")
    plt.show()


# Adquirindo base de dados
mnist = tf.keras.datasets.mnist

# Carregando conjunto de treinamento e teste
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Ilustrando uma amostra
show_mnist(x_train, 0)

# Definindo a estrutura da rede convolutiva (DL)
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])

# Definindo critérios de otimização, perdas e parada
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Treinando a rede, note que ele utiliza apenas o conjunto de treinamento.
# A rede irá parar o treinamento após 10 épocas
model.fit(x_train, y_train, epochs=10)

# Verificando o teste, afere a qualidade do treinamento
model.evaluate(x_test, y_test)

# Um resumo do modelo
model.summary()

