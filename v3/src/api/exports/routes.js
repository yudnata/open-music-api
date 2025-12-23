const express = require('express');
const authenticateToken = require('../../middleware/auth');

const routes = (handler) => {
  const router = express.Router();

  router.post(
    '/playlists/:playlistId',
    authenticateToken,
    (req, res, next) => handler.postExportPlaylistHandler(req, res, next)
  );

  return router;
};

module.exports = routes;
