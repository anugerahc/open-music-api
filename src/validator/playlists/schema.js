const Joi = require('joi');

const playlistPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
});

const playlistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {playlistPayloadSchema, playlistSongPayloadSchema};
