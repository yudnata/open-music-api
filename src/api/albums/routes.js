const express = require('express');
const authenticateToken = require('../../middleware/auth');

const routes = (handler, upload) => {
  const router = express.Router();

  router.post('/', handler.postAlbumHandler);
  router.get('/:id', handler.getAlbumByIdHandler);
  router.put('/:id', handler.putAlbumByIdHandler);
  router.delete('/:id', handler.deleteAlbumByIdHandler);

  router.post('/:id/covers', upload.single('cover'), handler.postAlbumCoverHandler);

  router.post('/:id/likes', authenticateToken, handler.postAlbumLikeHandler);
  router.delete('/:id/likes', authenticateToken, handler.deleteAlbumLikeHandler);
  router.get('/:id/likes', handler.getAlbumLikesHandler);

  return router;
};

module.exports = routes;
