const Joi = require('joi');
const currentYear = new Date().getFullYear();

const albumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(currentYear).required(),
});

const albumCoverPayloadSchema = Joi.object({
    'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = {albumPayloadSchema, albumCoverPayloadSchema};
