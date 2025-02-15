# TpDsw - Backend - La Gallega

# Participantes
- Ortiz Valentino
- Sanchez Enzo
- Spertino Mateo
# Material de entrega
- [Video](https://drive.google.com/file/d/1TnUO39xDpfR4aPAB2YUa01DZgtQRyVMF/view?usp=sharing)
- [Link al Pull Request](https://github.com/enzosanchezariel/TpDsw-Backend/pulls)
# Instalación
## Instale NPM, NodeJS y MySQL
- [NodeJS](https://nodejs.org/en/download/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
## Instale las dependencias
- Abra la linea de comandos y dirijase a la raiz del proyecto:

```
cd path/to/project
```
- Instale las dependencias del proyecto con siguiente comando:

```
npm install
```
## Cree la base de datos
- Abra la linea de comandos e inicie sesión en root o un usuario con privilegios

```sql
mysql -u root -p
```
- Cree el Schema

```sql
CREATE SCHEMA la_gallega;
```
## Configure el usuario MySQL del proyecto
- Edite el archivo .env y añada su usuario y contraseña de mysql
## Compile y ejecute el proyecto
- Abra una línea de comandos en la raiz del proyecto:

```
cd path/to/project
```
- Ejecute el siguiente comando:

```
npm run start:dev
```
