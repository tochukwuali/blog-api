# Blog API (Node.js + Express + MongoDB)


# API Endpoints Documentation

## Auth Routes

### POST /api/auth/signup
- **Access:** Public  
- **Description:** Register a new user  
- **Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /api/auth/login
- **Access:** Public  
- **Description:** Authenticate user and return a JWT  
- **Body:**
```json
{
  "email": "johndoe@gmail.com",
  "password": "altschoolpass"
}
```
- **Response:**
```json
{
  "token": "your_jwt_token"
}
```

---

## Blog Routes

### POST /api/blogs
- **Access:** Private (JWT)  
- **Description:** Create a new blog post (defaults to `draft`)  
- **Body:**
```json
{
  "title": "My Blog Title",
  "description": "Short summary",
  "tags": ["tech", "learning"],
  "body": "This is the full blog content"
}
```

### GET /api/blogs
- **Access:** Public  
- **Description:** Get list of published blogs  
- **Query Parameters:**
  - `page` – default `1`
  - `limit` – default `20`
  - `search` – title, tags, or author name
  - `sort` – `read_count`, `reading_time`, `timestamp`

### GET /api/blogs/:id
- **Access:** Public  
- **Description:** Get a single published blog and increment its `read_count`

### GET /api/blogs/user/blogs
- **Access:** Private (JWT)  
- **Description:** Get blogs created by the authenticated user  
- **Query Parameters:**
  - `state` – `draft` or `published`
  - `page` – default `1`
  - `limit` – default `20`

### PATCH /api/blogs/:id
- **Access:** Private (JWT, Owner only)  
- **Description:** Update a blog (in any state)  
- **Body:** (Any updatable fields)
```json
{
  "title": "Updated Title",
  "body": "Updated body content"
}
```

### PATCH /api/blogs/:id/publish
- **Access:** Private (JWT, Owner only)  
- **Description:** Change blog state to `published`

### DELETE /api/blogs/:id
- **Access:** Private (JWT, Owner only)  
- **Description:** Delete a blog (in any state)

---

## Authentication

- Add the following header to all protected routes:

```http
Authorization: Bearer <your_token>
```

---

## Blog Model Structure

| Field         | Type     | Description                           |
|---------------|----------|---------------------------------------|
| title         | String   | Blog title                            |
| description   | String   | Short summary                         |
| tags          | [String] | Related tags                          |
| author        | ObjectId | Linked to the User model              |
| body          | String   | Full blog content                     |
| state         | String   | Either `draft` or `published`         |
| read_count    | Number   | Auto-incremented on blog read         |
| reading_time  | String   | Estimated based on word count (200wpm)|
| created_at    | Date     | Blog creation time                    |
