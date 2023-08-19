const {albumPayloadSchema, albumCoverPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumValidator {
    validateAlbumPayload = (payload) => {
        const validationResult = albumPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
        return validationResult.value;
    };

    validateAlbumCoverPayload = (headers) => {
        const validationResult = albumCoverPayloadSchema.validate(headers);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    };

};

module.exports = {AlbumValidator};
