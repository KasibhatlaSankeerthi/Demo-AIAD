# Backend Coding Standards

Conventions for the Express + MySQL backend. Follow these for all new
routes/controllers/services.

## Response shape

- Success responses return the resource/data directly as JSON with the
  appropriate 2xx status code, e.g. `res.status(200).json({ status: 'ok' })`.
- Error responses are always `{ error: <message> }` — never leak stack
  traces or raw driver errors to the client.

## Error handling

- Controllers throw `AppError(message, statusCode)` (see
  [backend/src/utils/AppError.js](../src/utils/AppError.js)) for expected
  failures (validation, not found, auth, etc.).
- Every async route handler is wrapped in `asyncWrapper` (see
  [backend/src/utils/asyncWrapper.js](../src/utils/asyncWrapper.js)) so
  rejected promises reach Express's error handling instead of crashing the
  process.
- A single `errorHandler` middleware (see
  [backend/src/middleware/errorHandler.js](../src/middleware/errorHandler.js))
  is registered last in [backend/src/app.js](../src/app.js), after all
  routes. It maps `AppError` to its `statusCode`/`message`, and anything
  else to a generic `500` with `{ error: 'Internal server error' }`.

## SQL parameterization

- All queries go through the shared pool in
  [backend/src/config/db.js](../src/config/db.js) (`mysql2/promise`).
- Always use parameterized queries with `?` placeholders and pass values as
  the second argument to `pool.query`/`pool.execute` — never build SQL by
  concatenating or interpolating user input.

  ```js
  // Correct
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

  // Wrong — never do this
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
  ```

## RBAC conventions

RBAC middleware doesn't exist yet, but new authenticated routes must follow
this shape once it lands:

- A `requireRole(...roles)` middleware sits in the route chain after
  authentication and before the controller, e.g.
  `router.post('/items', requireAuth, requireRole('admin'), createItem)`.
- A failed role check throws `AppError('Forbidden', 403)` so it flows
  through the standard error handler and response shape above.
- Role names are lowercase strings defined in one shared constants module —
  never hardcode role strings inline in more than one place.
