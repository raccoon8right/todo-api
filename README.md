# TODO API

## ¿Qué hace el proyecto?

El proyecto es un ejemplo de como crear una API para trabajar por capas con los métodos HTTP y profundizar en el manejo de endpoints.

## Requisitos

- Node.js
- MySQL

## Como instalarlo

1. Copiar el https del repositorio
2. hacer `git clone <url>` en tu terminal
3. Entrar a la carpeta e instalar las dependencias con `npm install`


## Como configurar el .env

Copiar el archivo `.env.example`, renómbralo a `.env` y completa los valores:

- `DB_HOST` - host del servidor de base de datos. Usar `localhost` para local o `host.docker.internal` si se ejecuta dentro de un contenedor Docker
- `DB_USER` - tu usuario de MySQL
- `DB_PASSWORD` - tu contraseña de MySQL
- `DB_NAME` - nombre de tu base de datos
- `PORT` - puerto del servidor
- `JWT_SECRET` - clave secreta para firmar los tokens JWT. Generar una con el siguiente comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

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

## Docker

### Dockerfile
El `Dockerfile` define la imagen de la aplicación:
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
```

El `COPY` doble es una optimización - al copiar primero solo el `package*.json` e instalar las dependencias, Docker cachea esa capa y no reinstala los paquetes en cada build a menos que cambien las dependencias.

### Construir la imagen
```bash
docker build -t todo-api .
```

### Correr el contenedor
```bash
docker run -p 3000:3000 --env-file .env todo-api
```

- `-p 3000:3000` - mapea el puerto 3000 del host al puerto 3000 del contenedor
- `--env-file .env` - inyecta las variables de entorno al contenedor 