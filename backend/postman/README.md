# Postman Test Guide

## Files

- Collection: `backend/postman/Eatsy-Recipe-API.postman_collection.json`

## Before testing

1. Create `backend/.env` from `backend/.env.example`.
2. Make sure MongoDB is running.
3. Start the backend from `backend/` with:

```powershell
npm run dev
```

Default base URL:

```text
http://localhost:5000
```

## Import into Postman

1. Open Postman.
2. Import `backend/postman/Eatsy-Recipe-API.postman_collection.json`.
3. Open the collection variables and adjust:
   - `baseUrl`
   - `email`
   - `password`
   - `name`

## Recommended test order

1. `Register User`
2. `Login User`
3. `Create Recipe - Success`
4. `Create Recipe - Missing Ingredients`
5. `Create Recipe - Unauthorized`

## What to verify

- `Create Recipe - Success` returns `201`
- response body contains `data.recipe`
- `data.recipe.author` matches the logged-in user id
- `data.recipe.source` is `"user"`
- request body `author` is ignored
- invalid `ingredients` returns `400`
- missing token returns `401`
