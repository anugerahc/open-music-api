const Joi = require('joi');

const ExportPlaylistSchema = Joi.object({
    targetEmail: Joi.string().email({tlds: true}).required(),
});

module.exports = {ExportPlaylistSchema};
