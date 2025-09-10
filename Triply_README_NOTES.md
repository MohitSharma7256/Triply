## Triply Story (Full Stack) - Deep Dive Notes

These notes explain how the codebase works, including architecture, data models, main features, authentication flow, key implementation details, and some interview-style Q&A. It also highlights potential issues and improvements.

### Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer, CORS
- **Frontend**: React, React Router, Axios, TailwindCSS, Vite, react-toastify, slick-carousel

### Project Structure
- `backend/`
  - `index.js`: Express app; routes for auth, travel stories, future trips, image upload, and static files.
  - `utilities.js`: `authenticateToken` middleware (JWT verification).
  - `models/`
    - `user.model.js`: User schema.
    - `travelStory.model.js`: Travel story schema.
    - `futureTrip.model.js`: Future trip schema.
  - `multer.js`: Upload configuration; local disk storage to `uploads/`.
  - `config.json`: Contains a MongoDB connection string (see Security section).
  - `uploads/`: Stored images served statically at `/uploads`.
- `frontend/`
  - `src/App.jsx`: Routes for `/`, `/login`, `/signUp`, `/dashboard`, `/future-trips`, `/about`.
  - `src/pages/Auth/Login.jsx`, `SignUp.jsx`: Auth screens; call backend and save token.
  - `src/pages/Home/*`: Home, About, Add/Edit story, View story.
  - `src/pages/FutureTrips/FutureTrips.jsx`: CRUD for future trips.
  - `src/components/*`: UI components and inputs (PasswordInput, ImageSelector, TagInput, etc.).
  - `src/utils/axiosInstance.js`: Axios client with base URL and auth header injector.
  - `src/utils/constants.js`: `BASE_URL` = `http://localhost:8000`.

### Data Models (Mongoose)
- `User`
  - `fullName: String!`
  - `email: String! (unique)`
  - `password: String!` (bcrypt hashed)
  - `createdOn: Date = now`

- `TravelStory`
  - `title: String!`
  - `story: String!`
  - `visitedLocation: [String] = []`
  - `isFavourite: Boolean = false`
  - `userId: ObjectId (ref User)!`
  - `createdOn: Date = now`
  - `imageUrl: [String]!` (array of URLs)
  - `visitedDate: Date!`

- `FutureTrip`
  - `title: String!`
  - `destination: String!`
  - `startDate: Date!`
  - `endDate: Date!`
  - `description: String?`
  - `budget: Number?`
  - `accommodation: String?`
  - `activities: [String] = []`
  - `userId: ObjectId (ref User)!`
  - `timestamps: true`

### Authentication Flow
1. Signup (`POST /create-account`)
   - Validates `fullName`, `email`, `password`.
   - Hashes password with bcrypt.
   - Creates user and signs a JWT `{ userId }` with `ACCESS_TOKEN_SECRET`, expires in 72h.
   - Returns `{ success, message, user, accessToken }`.

2. Login (`POST /login`)
   - Validates `email`, `password`.
   - Finds user by email; compares with bcrypt.
   - Signs JWT as above; returns `{ message, accessToken, user }`.

3. Protected routes
   - `authenticateToken` middleware reads `Authorization: Bearer <token>` and verifies JWT using `ACCESS_TOKEN_SECRET`. Adds `req.user = { userId }`.

4. Frontend token storage and usage
   - Login/SignUp pages store token using key `accessToken`.
   - `axiosInstance` reads token from localStorage key `token` and sets `Authorization` header. This is a mismatch; see Important Details.

### API Endpoints (Backend)
- Auth
  - `POST /create-account` → create user, returns `accessToken` and user info.
  - `POST /login` → login user, returns `accessToken` and user info.
  - `GET /get-user` → requires JWT, returns authenticated user (no password).

- Travel Stories
  - `POST /add-travel-story` → requires JWT. Body: `title, story, visitedLocation, imageUrl, visitedDate`.
  - `PUT /edit-travel-story/:id` → requires JWT. Partial update fields supported.
  - `DELETE /delete-travel-story/:id` → requires JWT.
  - `PUT /update-favourite/:id` → requires JWT; toggles `isFavourite`.
  - `GET /search/filter?query=...` → requires JWT; search by `title/story/visitedLocation`.
  - `GET /get-all-stories` → requires JWT; returns all stories sorted by `createdOn`.

- Future Trips
  - `GET /future-trips` → requires JWT; current user's trips.
  - `POST /future-trips` → requires JWT; create.
  - `PUT /future-trips/:id` → requires JWT; update.
  - `DELETE /future-trips/:id` → requires JWT; delete.

- Images
  - `POST /image-upload` → multipart form-data `image`; returns `imageUrl` and `filename`. Stored in `uploads/` and served at `/uploads/<filename>`.
  - `DELETE /delete-image` → body `{ imageUrl }`; deletes from disk.

### Frontend Routing
- `/` → redirect based on token presence (see mismatch note).
- `/login`, `/signUp` → auth screens.
- `/dashboard` → main home feed (stories UI).
- `/future-trips` → future trips management.
- `/about` → about page.

### Important Implementation Details and Observations
- **Environment variables**
  - Backend reads `MONGODB_URI` and `ACCESS_TOKEN_SECRET` from `.env` (via `dotenv`). If `MONGODB_URI` is absent, defaults to `mongodb://localhost:27017/travel-story-app`.

- **Token storage key mismatch (fix recommended)**
  - `Login.jsx`/`SignUp.jsx` store token under key `accessToken`:
    - `localStorage.setItem("accessToken", response.data.accessToken)`
  - `axiosInstance.js` reads token under key `token`:
    - `const accessToken = localStorage.getItem("token");`
  - Result: authenticated requests will miss the header unless the key names match. Two options:
    - Change axios to read `accessToken`, or
    - Change Login/SignUp to write `token`.

- **`TravelStory.imageUrl` is an array**
  - Backend model expects `[String]`.
  - `AddEditTravelStory.jsx` collects multiple images but currently submits only the first image as a string (`imageUrl: imageUrls[0]`). To support multiple images end-to-end, update backend to accept arrays in the route handler or send the full array.

- **CORS**
  - Backend CORS origin is `http://localhost:5173` (Vite default); credentials enabled.

- **Static uploads**
  - `app.use("/uploads", express.static("uploads"))` serves images publicly.

### Setup and Running Locally
1. Backend
   - Create `backend/.env` with:
     - `MONGODB_URI=<your mongodb uri>`
     - `ACCESS_TOKEN_SECRET=<random-long-secret>`
   - From `backend/`: `npm install && node index.js` (or `nodemon index.js`).
   - Server runs at `http://localhost:8000`.

2. Frontend
   - From `frontend/`: `npm install && npm run dev`.
   - App runs at `http://localhost:5173`.

### Credentials Found in Repository (for your reference)
- `backend/config.json` contains a MongoDB Atlas connection string including credentials:
  - Username: `ms1361277`
  - Password: `EZTgCc7E4RdlxPP4`
  - Connection string is currently: `mongodb+srv://<user>:<pass>@travelstory.8w31urx.mongodb.net/...`

Security guidance:
- Move credentials to environment variables and delete `backend/config.json` from version control.
- Rotate the MongoDB password and `ACCESS_TOKEN_SECRET` immediately if this repo has been shared.

### Example cURL Calls
```bash
# Signup
curl -X POST http://localhost:8000/create-account \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"Pass@123"}'

# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass@123"}'

# Authenticated: Get user
curl http://localhost:8000/get-user \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Potential Improvements
- Unify token key between frontend storage and axios interceptor.
- Accept and persist multiple images for stories consistently.
- Scope `GET /get-all-stories` to the authenticated user (currently returns all users' stories).
- Add validation for dates and ranges on backend routes.
- Replace `config.json` with environment variables and secrets management.

### Interview Questions and Model Answers
- Q: How is authentication implemented end-to-end?
  - A: Users sign up and log in via `/create-account` and `/login`. Passwords are hashed with bcrypt. A JWT containing `{ userId }` is signed with `ACCESS_TOKEN_SECRET` (72h expiry) and returned as `accessToken`. The frontend stores the token and includes it as `Authorization: Bearer <token>` via an axios interceptor. Protected routes use `authenticateToken` to verify and populate `req.user`.

- Q: Where are user passwords stored and how are they secured?
  - A: In MongoDB via Mongoose `User` model; stored as bcrypt hashes (`bcrypt.hash(password, 10)`), never in plaintext. Verification uses `bcrypt.compare`.

- Q: How are images handled in the app?
  - A: The backend uses Multer with disk storage (`uploads/`) and an image-only file filter with a 5 MB limit. `/image-upload` returns a public URL served by `express.static` at `/uploads`.

- Q: Describe the data model for a travel story and its relationship to users.
  - A: `TravelStory` has `title`, `story`, `visitedLocation` (array), `imageUrl` (array of strings), `visitedDate`, `isFavourite`, and `userId` referencing `User`. Each story belongs to exactly one user.

- Q: Where does the backend get its configuration and secrets?
  - A: Primarily from `.env` via `dotenv` (`MONGODB_URI`, `ACCESS_TOKEN_SECRET`). A `config.json` file exists in the repo that includes a MongoDB connection string, which should be moved to environment variables for security.

- Q: What are some security concerns in the current setup?
  - A: Secrets committed to VCS (`config.json`), token key mismatch causing possible missing auth header, public serving of uploaded files without auth checks, and one endpoint (`/get-all-stories`) not scoping by `userId`.

- Q: How would you fix the token key mismatch between frontend and axios?
  - A: Either change `axiosInstance` to read `accessToken` from localStorage or update Login/SignUp to store under `token`. Ensure routing guards also check the same key consistently.

- Q: How does the app filter travel stories by date and by text?
  - A: Text search via `GET /search/filter?query=...` using case-insensitive `$regex` on `title`, `story`, `visitedLocation`. Date range via `GET /travel-stories/filter?startDate=<ms>&endDate=<ms>` filtering `visitedDate` with `$gte/$lte`.

- Q: What is the purpose of `authenticateToken` middleware?
  - A: Verify JWT from the `Authorization` header using `ACCESS_TOKEN_SECRET`, reject unauthorized or expired tokens, and attach the decoded payload to `req.user`.

### Notes for Future You
- Keep `.env` out of version control. Rotate leaked credentials.
- Align token key usage across storage, interceptors, and route guards.
- Consider moving image storage to a cloud bucket (S3, Cloudinary) for production.


