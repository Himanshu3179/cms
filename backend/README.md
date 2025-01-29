Here are all the API endpoints from the backend:

### Feeds Routes

1. **Get all feeds**
   - **Endpoint**: `/api/feeds`
   - **Method**: `GET`

### Filters Routes

1. **Get available filters**
   - **Endpoint**: `/api/filters`
   - **Method**: `GET`

### Article Routes

1. **Get all articles**

   - **Endpoint**: `/api/articles`
   - **Method**: `GET`

2. **Get a specific article by ID**

   - **Endpoint**: `/api/articles/:id`
   - **Method**: `GET`

3. **Create a new article**

   - **Endpoint**: `/api/articles`
   - **Method**: `POST`

4. **Update an article**

   - **Endpoint**: `/api/articles/:id`
   - **Method**: `PUT`

5. **Delete an article**

   - **Endpoint**: `/api/articles/:id`
   - **Method**: `DELETE`

6. **Admin-only route to delete any article**
   - **Endpoint**: `/api/articles/admin/:id`
   - **Method**: `DELETE`

### User Routes

1. **User registration**

   - **Endpoint**: `/api/users/register`
   - **Method**: `POST`

2. **User login**

   - **Endpoint**: `/api/users/login`
   - **Method**: `POST`

3. **Get user profile (protected route)**

   - **Endpoint**: `/api/users/profile`
   - **Method**: `GET`

4. **Promote user role (admin only)**

   - **Endpoint**: `/api/users/promote`
   - **Method**: `POST`

5. **Demote user role (admin only)**
   - **Endpoint**: `/api/users/demote`
   - **Method**: `POST`

### Admin Article Routes

1. **Get all admin articles**

   - **Endpoint**: `/api/admin-articles`
   - **Method**: `GET`

2. **Get a specific admin article by ID**

   - **Endpoint**: `/api/admin-articles/:id`
   - **Method**: `GET`

3. **Create a new admin article (protected, admin access required)**

   - **Endpoint**: `/api/admin-articles`
   - **Method**: `POST`

4. **Update an admin article (protected, admin access required)**

   - **Endpoint**: `/api/admin-articles/:id`
   - **Method**: `PUT`

5. **Delete an admin article (protected, admin access required)**
   - **Endpoint**: `/api/admin-articles/:id`
   - **Method**: `DELETE`

### Admin Routes

1. **Update user role (admin only)**

   - **Endpoint**: `/api/admin/update-role`
   - **Method**: `POST`

2. **Get all users (admin only)**
   - **Endpoint**: `/api/admin/users`
   - **Method**: `GET`
