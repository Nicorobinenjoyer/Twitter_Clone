# Clon de Twitter

## Descripción del Proyecto

Este proyecto es un clon de la popular red social Twitter, desarrollado con **Node.js**, **Vite** para la configuración del frontend, **Tailwind CSS** para el diseño y la estilización, **Python** para la lógica del backend, y **PostgreSQL** como base de datos. El proyecto está dockerizado para facilitar su instalación y ejecución.

## Pasos para Ejecutar el Proyecto de forma Local

### Requisitos

- Docker instalado.
- Sistema operativo basado en Linux o Windows.
- Git para clonar el repositorio o descargar el archivo comprimido desde GitHub.

### Instrucciones

1. **Descargar Docker Desktop**

   Si no tienes Docker instalado, sigue estos pasos para descargar e instalar Docker Desktop:

   - Dirígete a la página oficial de Docker: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
   - Descarga la versión de Docker Desktop correspondiente a tu sistema operativo (Windows o macOS).
   - Sigue las instrucciones del instalador para completar la instalación.
   - Una vez instalado, abre Docker Desktop y asegúrate de que Docker esté corriendo correctamente.

   Para usuarios de Linux, sigue la [guía de instalación de Docker para Linux](https://docs.docker.com/engine/install/).

2. **Descargar el repositorio desde GitHub**

   Puedes descargar el proyecto desde GitHub en formato `.zip` o `.rar`:

   - Dirígete al repositorio de GitHub del proyecto y selecciona la opción de descargar el archivo comprimido, ubicado dandole click al boton verde que dice "Code"
   - Alternativamente, clona el repositorio utilizando Git con el siguiente comando:
     ```bash
     git clone https://github.com/Nicorobinenjoyer/Twitter_Clone.git
     ```

3. **Descomprimir el archivo descargado**

   - Si has descargado el archivo comprimido (`.zip` o `.rar`), guárdalo en la carpeta `Descargas` por defecto o en el Escritorio para mayor comodidad.
   - Descomprime el archivo utilizando tu herramienta preferida, como WinRAR, 7-Zip, o la herramienta de descompresión predeterminada del sistema operativo.

4. **Mover a la carpeta del proyecto**

   - **_Opcion 1:_** Abre la terminal y navega hasta la carpeta donde descomprimiste el proyecto en la carpeta `Descargas`:

     ```bash
     cd Descargas\Twitter_Clone-master
     ```

     ```bash
     cd Downloads\Twitter_Clone-master
     ```

   - **_Opcion 2:_** Abre la terminal y navega hasta la carpeta donde descomprimiste el proyecto en la carpeta `Escritorio`:

     ```bash
     cd Escritorio\Twitter_Clone-master
     ```

     ```bash
     cd Desktop\Twitter_Clone-master
     ```

5. **Construir y levantar los contenedores con Docker**

- Asegúrate de tener Docker corriendo en tu máquina virtual.
- Ejecuta el siguiente comando para construir los contenedores y levantar el proyecto por primera vez:
  ```bash
  docker-compose up --build
  ```

6. **Acceder a la aplicación**

- Una vez que los contenedores estén corriendo, podrás acceder a la aplicación desde tu navegador ingresando a:
  ```
  http://localhost:5173
  ```

## Recomendaciones

- **Guardar en Descargas o Escritorio**: Se recomienda descargar y descomprimir el archivo en la carpeta `Descargas` o el `Escritorio` para facilitar el acceso y manipulación.
- **Levantar los contenedores por segunda vez:** Para volver a levantar los contenedores del proyecto con Docker solo ejecuta el siguiente comando:
  ```bash
   docker-compose up
  ```
  Ya que si vuelves a construir todo el proyecto se borran los registros de la base de datos.
