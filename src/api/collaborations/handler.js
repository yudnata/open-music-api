class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { id: credentialId } = req.user;
      const { playlistId, userId } = req.body;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._usersService.getUserById(userId);

      const collaborationId = await this._collaborationsService.addCollaboration(
        playlistId,
        userId
      );

      return res.status(201).send({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { id: credentialId } = req.user;
      const { playlistId, userId } = req.body;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return res.status(200).send({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CollaborationsHandler;
