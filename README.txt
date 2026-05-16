================================================================================
                    MANUAL DE INSTALACION - FRONTEND
                    SISTEMA MAQUINARIA Y SERVICIO AGRICOLA
================================================================================

Este documento explica como instalar y ejecutar la parte visual (FRONTEND).

ATENCION: Este proyecto usa YARN como gestor de paquetes, NO npm.

================================================================================
PASO 1: INSTALAR NODE.JS
================================================================================

Node.js es necesario para ejecutar el frontend.

INSTRUCCIONES:

1. Ve a: https://nodejs.org/

2. Descarga la version LTS (recomendada para la mayoria)

3. Ejecuta el instalador con todas las opciones por defecto

4. VERIFICAR:
   - Presiona WINDOWS + R
   - Escribe "cmd" y presiona ENTER
   - Escribe: node --version
   - Deberias ver un numero como v18.17.0

================================================================================
PASO 2: INSTALAR YARN
================================================================================

Yarn es el programa que maneja las dependencias del proyecto.

INSTRUCCIONES:

1. Abre la terminal (CMD)

2. Instala Yarn globalmente con este comando:
   npm install -g yarn

3. VERIFICAR QUE SE INSTALO:
   - Escribe: yarn --version
   - Deberias ver un numero como 1.22.19

================================================================================
PASO 3: INSTALAR DEPENDENCIAS CON YARN
================================================================================

1. Abre la terminal (CMD)

2. Navega a la carpeta del frontend:
   cd ruta/donde/esta/la/carpeta/frontend

3. Ejecuta:
   yarn install

   (NOTA: Es "yarn install", no "npm install")

4. Espera a que termine la instalacion

================================================================================
PASO 4: CONFIGURAR LA URL DEL BACKEND (IMPORTANTE)
================================================================================

El frontend necesita saber donde esta el backend para conectarse.

UBICACION DEL ARCHIVO A MODIFICAR:

   frontend/src/context/ConfigContext.jsx

QUE DEBES CAMBIAR:

Dentro del archivo ConfigContext.jsx busca esta linea:

   const URL = 'http://localhost:3000';

CAMBIALA segun donde este alojado el backend:

   - Si el backend esta en tu misma computadora:
     const URL = 'http://localhost:3000';

   - Si el backend esta en un servidor remoto (ejemplo):
     const URL = 'https://tudominio.com:3000';
     o
     const URL = 'http://192.168.1.100:3000';

   - Si el backend usa otro puerto:
     const URL = 'http://localhost:3001';


================================================================================
PASO 5: VERIFICAR QUE EL BACKEND ESTE CORRIENDO
================================================================================

IMPORTANTE: El frontend NO funcionara si el backend no esta ejecutandose.

ANTES DE ABRIR EL FRONTEND:
1. Abre OTRA ventana de terminal
2. Ejecuta el backend (con npm run start:dev)
3. Deja ESA ventana ABIERTA
4. Continua con el paso siguiente

================================================================================
PASO 6: EJECUTAR EL FRONTEND CON YARN
================================================================================

1. En la terminal (estando en la carpeta del frontend), ejecuta:
   yarn dev

   (NOTA: Es "yarn dev", no "npm run dev")

2. Veras un mensaje como:
   Local: http://localhost:5173/

3. Abre tu navegador y escribe esa direccion

4. El sistema ya deberia estar funcionando

================================================================================
PASO 7: CONSTRUIR PARA PRODUCCION (SUBIR A SERVIDOR)
================================================================================

Si vas a subir el frontend a un servidor web (Netlify, Vercel, hosting propio):

1. Primero, asegurate de cambiar la URL en ConfigContext.jsx a la direccion del servidor

2. En la terminal, ejecuta:
   yarn build

   (NOTA: Es "yarn build", no "npm run build")

3. Esto creara una carpeta "dist" con los archivos listos para subir

4. Sube TODO el contenido de la carpeta "dist" a tu servidor web

================================================================================
PASO 8: DETENER EL FRONTEND
================================================================================

Para apagar el frontend:

1. Ve a la terminal donde esta corriendo
2. Presiona Ctrl + C
3. Escribe "S" si pregunta y presiona ENTER

================================================================================
PASO 9: SOLUCION DE PROBLEMAS COMUNES
================================================================================

PROBLEMA: "yarn no se reconoce como comando"
SOLUCION: Instala Yarn con: npm install -g yarn

PROBLEMA: "Error: Cannot find module" o "error Command failed"
SOLUCION: Ejecuta "yarn install" nuevamente

PROBLEMA: Pantalla en blanco o "Failed to fetch"
SOLUCION: 
   - El backend no esta corriendo
   - La URL en ConfigContext.jsx es incorrecta
   - Verifica que el backend este en la direccion que configuraste

PROBLEMA: No cargan los estilos
SOLUCION: Limpia la cache del navegador (Ctrl + F5)

PROBLEMA: El puerto 5173 ya esta ocupado
SOLUCION: El sistema usara automaticamente el siguiente puerto disponible (5174, 5175...)

================================================================================
PASO 10: COMPARACION DE COMANDOS (npm vs yarn)
================================================================================

| ACCION                    | CON NPM                    | CON YARN (ESTE PROYECTO) |
|---------------------------|----------------------------|---------------------------|
| Instalar dependencias     | npm install                | yarn install              |
| Agregar una dependencia   | npm install paquete        | yarn add paquete          |
| Ejecutar en desarrollo    | npm run dev                | yarn dev                  |
| Construir para produccion | npm run build              | yarn build                |
| Ver version               | npm --version              | yarn --version            |

================================================================================
PASO 11: RESPUESTAS RAPIDAS
================================================================================

P: ¿Cada vez que uso el sistema tengo que ejecutar estos comandos?
R: Si. Siempre necesitas tener el backend y frontend ejecutandose en dos terminales.

P: ¿Puedo cerrar la terminal despues de ejecutar?
R: No. Si cierras la terminal, el sistema se apaga.

P: ¿Como hago para que otros usuarios accedan?
R: Debes subir el backend a un servidor con IP publica y cambiar la URL en el frontend.

P: ¿Que pasa si cambia la IP del servidor?
R: Debes actualizar la URL en ConfigContext.jsx y reconstruir el frontend.

P: ¿Por que uso Yarn y no npm?
R: El proyecto fue configurado originalmente con Yarn. Ambos funcionan igual,
    pero los comandos son diferentes.

================================================================================
FIN DEL MANUAL DEL FRONTEND
================================================================================