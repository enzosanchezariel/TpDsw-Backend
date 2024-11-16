# TpDsw - Backend - La Gallega
## Participantes
- Ortiz Valentino
- Sanchez Enzo
- Spertino Mateo
# Instalación
## Instale NPM, NodeJS y MySQL
- [NodeJS](https://nodejs.org/en/download/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
## Instale las dependencias
- Abra la linea de comandos y dirijase a la raiz del proyecto
- Ejecute el siguiente comando "npm install"
## Cree un nuevo Schema llamado la_gallega
- Abra la linea de comandos e inicie sesión en root o un usuario con privilegios
    ```sql
mysql -u root -p
```
- Cree el Schema
    ```sql
CREATE SCHEMA la_gallega;
```
## Configure el usuario MySQL del proyecto
- Edite el archivo /src/shared/db/orm.ts y reemplace "dsw" en clientUrl por el nombre del usuario de MySQL (generalmente root)
- Reemplace "dsw" por la contraseña en el campo de password
## Compile y ejecute el proyecto
- Abra una línea de comandos en la raiz del proyecto
- Ejecute el siguiente comando:
    ```
npm run start:dev
```