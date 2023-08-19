require('dotenv').config();
const config = require('./utils/config.js');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');


// Albums
const albums = require('./api/albums');
const AlbumService = require('./services/albums/AlbumService');
const {AlbumValidator} = require('./validator/albums');

// Storage
const StorageService = require('./services/storages/StorageService');

// Cache
const CacheService = require('./services/cache/CacheService');

// Exports Plugin
const _exports = require('./api/exports');
const ProducerService = require('./services/exports/ProducerService');
const {ExportPlaylistValidator} = require('./validator/exports');

// Songs
const songs = require('./api/songs');
const SongService = require('./services/songs/SongService');
const {SongValidator} = require('./validator/songs');

// Users
const users = require('./api/users');
const UserService = require('./services/users/UserService');
const {UserValidator} = require('./validator/users');

// Playlists
const playlists = require('./api/playlists');
const PlaylistService = require('./services/playlists/PlaylistService');
const {PlaylistValidator} = require('./validator/playlists');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationService = require('./services/authentication/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const {AuthenticationValidator} = require('./validator/authentications');

// Activities
const ActivityService = require('./services/activities/ActivityService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationService = require('./services/collaborations/CollaborationService');
const {CollaborationValidator} = require('./validator/collaborations');

// Exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const cacheService = new CacheService();
    const albumService = new AlbumService(cacheService);
    const albumValidator = new AlbumValidator();
    const songService = new SongService(cacheService);
    const songValidator = new SongValidator();
    const userService = new UserService();
    const userValidator = new UserValidator();
    const activityService = new ActivityService();
    const collaborationService = new CollaborationService(userService);
    const collaborationValidator = new CollaborationValidator();
    const playlistService = new PlaylistService(songService, activityService, collaborationService);
    const playlistValidator = new PlaylistValidator();
    const authenticationService = new AuthenticationService();
    const authenticationValidator = new AuthenticationValidator();
    const albumStorageService = new StorageService();

    const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    server.auth.strategy('open_music_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            Credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: albums,
            options: {
                albumService,
                storageService: albumStorageService,
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
        {
            plugin: playlists,
            options: {
                service: playlistService,
                validator: playlistValidator,
            }, 
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: userValidator,
            }, 
        },
        {
            plugin: authentications,
            options: {
                authenticationService,
                userService,
                tokenManager: TokenManager,
                validator: authenticationValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
              collaborationService,
              playlistService,
              validator: collaborationValidator,
            },
        },
        {
            plugin: _exports,
            options: {
              exportService: ProducerService,
              playlistService,
              validator: ExportPlaylistValidator,
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
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            console.error(response);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
