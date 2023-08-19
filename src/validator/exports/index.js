const {ExportPlaylistSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportPlaylistValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = ExportPlaylistSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }

        return validationResult.value;
    },
};

module.exports = {ExportPlaylistValidator};
