const asyncWrapper = require('../utils/asyncWrapper');

// Placeholder controller proving the app.js -> routes -> controller -> asyncWrapper plumbing works.
const getHealth = asyncWrapper(async (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = { getHealth };
