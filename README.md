# Crypto

Crypto es un programa que le permite encripar o desencriptar el contenido de archivos de texto, xml y json (con formato JWT). El contenido de los archivos de texto van separados por delimitadores que usted decide.
En el primer cuadro usted va a visualizar el documento que suba, en el otro cuadro va a visualizar el resultado con la posibilidad de descargarlo.

Para ocupar Crypto siga los siguientes pasos:

- Suba el archivo con el contenido que desea encriptar/desencriptar, seleccionando el botón que esté abajo del cuadro de texto referente al archivo de entrada.
- Asegurese de digitar el separador del archivo de texto y la clave para cifrar/descifrar
- Si su archivo de entrada o salida es XML, la clave tiene que ser númerica.
- Seleccione el botón con la opción que desee procesar

El programa automáticamente detectará el tipo de archivo y desencriptará o encriptará según sea el caso.

### Instalación

Crypto necesita [Node.js](https://nodejs.org/) v4+ para correr localmente.

Instalar las dependencias.

```sh
$ cd Crypto
$ npm install
$ node app
```

Una vez instaladas, ejecutar el siguiente comando:

```sh
$ npm run start
```

Repositorio: https://github.com/Meight10/Crypto
