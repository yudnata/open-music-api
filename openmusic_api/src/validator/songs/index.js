const { SongPayloadSchema } = require('./schema');
const BadRequestError = require('../../utils/BadRequestError');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
