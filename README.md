# TODO API

## ¿Qué hace el proyecto?

El proyecto es un ejemplo de como crear una API para trabajar por capas con los métodos HTTP y profundizar en el manejo de endpoints.

## Requisitos

-Node.js
-MySQL

## Como instalarlo

1. Copiar el https del repositorio
2. hacer `git clone <url>` en tu terminal
3. Entrar a la carpeta e instalar las dependencias con `npm install`


## Como configurar el .env

Copiar el archivo `.env.example`, renómbralo a `.env` y completa los valores:

- `DB_HOST` - ubicación del servidor (localhost si es local)
- `DB_USER` - tu usuario de MySQL
- `DB_PASSWORD` - tu contraseña de MySQL
- `DB_NAME` - nombre de tu base de datos
- `PORT` - puerto del servidor
- `JWT_SECRET` - texto largo y secreto para firmar los tokens

## Endpoints

### Auth
|  Método  |      Ruta      |      Descripción      |
|----------|----------------|-----------------------|
|  POST    | /auth/register | Registrar usuario     |
|  POST    | /auth/login    | Iniciar sesión        |

**POST /auth/register**
Body:
```json
{
    "nombre": "Juan",
    "email": "juan@gmail.com",
    "password": "123456"
}
```

**POST /auth/login**
Body:
```json
{
    "email": "juan@gmail.com",
    "password": "123456"
}
```

### Tareas - requieren header `Authorization: Bearer <token>`
|  Método  |      Ruta      |      Descripción      |
|----------|----------------|-----------------------|
|  GET     | /tareas        | Ver todas las tareas  |
|  POST    | /tareas        | Crear tarea           |
|  PUT     | /tareas/:id    | Editar tarea          |
|  DELETE  | /tareas/:id    | Eliminar tarea        |