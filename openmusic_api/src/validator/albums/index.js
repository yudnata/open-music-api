const { AlbumPayloadSchema } = require('./schema');
const BadRequestError = require('../../utils/BadRequestError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
