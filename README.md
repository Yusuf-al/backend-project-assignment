# Contact Management API

Backend implementation for extending Monica CRM contact functionality using:

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Cookies
* CORS

## Features Implemented

* Create contacts
* List contacts
* Search contacts
* Filter favorite contacts
* Mark/unmark favorite contacts
* Add/update personal notes
* Contact statistics
* Pagination support
* Sorting support

# Setup Instructions

## Prerequisites

Make sure you have installed:

* Node.js (v18+)
* PostgreSQL
* npm

## 1. Clone Repository

```bash
git clone <repository-url>

cd project-name
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT = [PORT]
DATABASE_URL=[DATABASE_URL]

JWT_ACCESS_SECRET=[ACCESS TOEKN]
JWT_REFRESH_SECRET=[ACCESS TOKEN]
JWT_ACCESS_EXPIRES_IN=[A_T EXPIRE TIME]
JWT_REFRESH_EXPIRES_IN=[R_T EXPIRE TIME]
BCRYPT_SALT_ROUNDS = [SALT ROUND] 
```

## 4. Database Setup

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

## 5. Run Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build

npm start
```

The API will run on:

```
http://localhost:[PORT]
```

# Implementation Approach

## Project Structure

The project follows a modular Express architecture:

```
src
│
├── modules
│   └── contacts
│       ├── contacts.controller.ts
│       ├── contacts.service.ts
│       ├── contacts.route.ts
│       └── contacts.interface.ts
│   └── users
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.route.ts
│       └── users.interface.ts
│   └── auth
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.route.ts
│       
│
├── middleware
|      └── auth.ts
|      └── index.d.ts
├── utils
│      ├── catchAsync.ts
│      ├── checkContact.ts
│      ├── jwt.ts
│      └── sendResponse.ts
├── lib
│   └── prisma.ts
│── app.ts
└── server.ts
```

# Authentication

Some contact routes require authentication. These routes are protected using JWT-based authentication middleware.

The client must send a valid authentication token (stored in cookies) before accessing protected endpoints.

## Protected Routes

The following routes require an authenticated user:

### Create New Contact

```http
POST /api/contacts/new
```

Required roles:

* ADMIN
* USER

### Get User's Contacts

```http
GET /api/contacts/all
```

Required roles:

* ADMIN
* USER

### Get Contact Statistics

```http
GET /api/contacts/stats
```

Required roles:

* ADMIN
* USER

## Authentication Flow

1. User logs in through the authentication endpoint.
2. Server generates a JWT token.
3. JWT token is stored in HTTP-only cookies.
4. The client sends the cookie automatically with future requests.
5. Authentication middleware validates the token before allowing access to protected routes.

## Example Request

After successful login, send:

```http
GET /api/contacts/all
```

with authentication cookie:

```http
Cookie:
accessToken=<your_jwt_token>
```

If the token is missing or invalid, the API will return an authentication error.


## API Implementation Approach

The contact listing endpoint was extended using dynamic Prisma filtering.

Supported queries:

```http
GET /api/contacts?favorite=1

GET /api/contacts?search=john

GET /api/contacts?favorite=1&search=john
```

The same query condition is reused for:

* Fetching contacts
* Counting total records

This avoids duplicated Prisma query logic.

## Pagination & Sorting

Existing pagination was maintained using:

* `skip`
* `take`

Sorting was implemented using Prisma `orderBy`.

Example:

```http
GET /api/contacts?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

# API Endpoints

## Create Contact

```http
POST /api/contacts/new
```

## Get Contacts

```http
GET /api/contacts
```

## Search Contacts

```http
GET /api/contacts?search=john
```

## Favorite Contacts

```http
GET /api/contacts/favorites
```

## Contact Statistics

```http
GET /api/contacts/stats
```

Example response:

```json
{
  "total_contacts": 125,
  "favorite_contacts": 18,
  "contacts_with_notes": 42
}
```

## Mark Favorite

```http
POST /api/contacts/:id/favorite
```

## Update Contact Note

```http
PUT /api/contacts/:id/note
```

# Conclusion

The implementation extends the Monica CRM contact module while maintaining clean architecture, reusable service logic, Prisma best practices, and scalable API design.
