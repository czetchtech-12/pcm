export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' })
}

export function errorHandler(err, _req, res, _next) {
  console.error(err)
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid request data', details: err.errors })
  }
  const status = err.status || err.statusCode || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
}
