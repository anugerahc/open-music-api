require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/albums/AlbumService');
const {AlbumValidator} = require('./validator/albums');
const songs = require('./api/songs');
const SongService = require('./services/songs/SongService');
const {SongValidator} = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumService = new AlbumService();
    const albumValidator = new AlbumValidator();
    const songService = new SongService();
    const songValidator = new SongValidator();
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: albumValidator,
            }, 
        },
        {
            plugin: songs,
            options: {
                service: songService,
                validator: songValidator,
            }, 
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const {response} = request;

        if (response instanceof Error){

            if (response instanceof ClientError){
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer){
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });

            newResponse.code(500);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
