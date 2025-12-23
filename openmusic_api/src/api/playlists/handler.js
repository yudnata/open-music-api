class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostPlaylistPayload(req.body);
      const { name } = req.body;
      const { id: credentialId } = req.user;

      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

      return res.status(201).send({
        status: 'success',
        data: {
          playlistId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistsHandler(req, res, next) {
    try {
      const { id: credentialId } = req.user;
      const playlists = await this._service.getPlaylists(credentialId);

      return res.status(200).send({
        status: 'success',
        data: {
          playlists,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylistByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.user;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return res.status(200).send({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostSongToPlaylistPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.user;

      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.addSongToPlaylist(id, songId);
      await this._service.addActivity(id, songId, credentialId, 'add');

      return res.status(201).send({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongsFromPlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.user;

      await this._service.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._service.getSongsFromPlaylist(id);

      return res.status(200).send({
        status: 'success',
        data: {
          playlist,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.user;

      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.deleteSongFromPlaylist(id, songId);
      await this._service.addActivity(id, songId, credentialId, 'delete');

      return res.status(200).send({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistActivitiesHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.user;

      await this._service.verifyPlaylistAccess(id, credentialId);
      const activities = await this._service.getPlaylistActivities(id);

      return res.status(200).send({
        status: 'success',
        data: {
          playlistId: id,
          activities,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaylistsHandler;
