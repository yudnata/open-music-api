class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(req, res, next) {
    try {
      this._validator.validateExportPlaylistPayload(req.body);

      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      const { id: userId } = req.user;

      // Only playlist owner can export
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        playlistId,
        targetEmail,
      };

      await this._producerService.sendMessage(
        'export:playlist',
        JSON.stringify(message)
      );

      return res.status(201).send({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ExportsHandler;
