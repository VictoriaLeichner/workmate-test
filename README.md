# Prueba Técnica Fullstack - Workmate

Mini-aplicación de gestión de productos con autenticación y roles (admin y user), desarrollada con Angular 13+, NestJS y PostgreSQL.

---

## Backend (NestJS)

### Instalación

1. Ir a la carpeta backend:
   cd backend
2. Instalar dependencias:
   npm install
3. Configurar variables de entorno (crear archivo .env):
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=usuario
   DB_PASSWORD=contraseña
   DB_DATABASE=workmate_test
   JWT_SECRET=clave_secreta
   JWT_EXPIRES_IN=3600s
  
4. Crear la base de datos en PostgreSQL:
   CREATE DATABASE workmate_test;

### Ejecutar el backend

npm run start:dev

Esto iniciará el servidor en http://localhost:3000.

### Endpoints principales

- POST /auth/login - Login con username y password.
- GET /products - Listar productos (user y admin).
- GET /products/:id - Ver un producto (user y admin).
- POST /products - Crear producto (solo admin).
- PUT /products/:id - Actualizar producto (solo admin).
- DELETE /products/:id - Eliminar producto (solo admin).


## Frontend (Angular 13+)

### Instalación

1. Ir a la carpeta frontend:
   cd frontend
2. Instalar dependencias:
   npm install

### Ejecutar el frontend

ng serve

Esto levantará la app en http://localhost:4200.

---

## Credenciales de prueba

- Admin
  - Usuario: admin
  - Contraseña: admin123
- User
  - Usuario: user
  - Contraseña: user123

---

### Autenticación

- Se implementa login con JWT usando el backend de NestJS.
- El token se genera en el backend con `@nestjs/jwt` y se envía al frontend.
- Roles: `admin` y `user`.
- El frontend guarda el token en `localStorage` y lo envía en las solicitudes que requieren autenticación.

---

## Pruebas manuales

Para verificar que la aplicación funciona correctamente:

1. Levantar backend con:
   npm run start:dev
2. Levantar frontend con:
   npm start
3. Abrir navegador en http://localhost:4200
4. Ingresar con credenciales de prueba:
   - Admin: admin / admin123
   - User: user / user123
5. Comprobar:
   - Admin puede crear, editar y eliminar productos
   - User solo puede ver productos
   - Toasts de éxito y error aparecen correctamente
   - Paginación funciona correctamente
   - Logout funciona