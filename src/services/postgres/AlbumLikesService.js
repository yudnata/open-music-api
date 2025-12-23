const { nanoid } = require('nanoid');
const pool = require('../../config/database');
const NotFoundError = require('../../utils/NotFoundError');
const InvariantError = require('../../utils/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }

  async verifyAlbumExists(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async likeAlbum(userId, albumId) {
    await this.verifyAlbumExists(albumId);

    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async unlikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal batal menyukai album. Anda belum menyukai album ini');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getAlbumLikesCount(albumId) {
    await this.verifyAlbumExists(albumId);

    try {
      const cachedResult = await this._cacheService.get(`album_likes:${albumId}`);
      return {
        likes: JSON.parse(cachedResult),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT COUNT(*)::int as likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rows[0].likes;

      await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(likes), 1800);

      return {
        likes,
        source: 'database',
      };
    }
  }
}

module.exports = AlbumLikesService;
