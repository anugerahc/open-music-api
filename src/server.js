require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Albums
const albums = require('./api/albums');
const AlbumService = require('./services/albums/AlbumService');
const {AlbumValidator} = require('./validator/albums');

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
    const albumService = new AlbumService();
    const albumValidator = new AlbumValidator();
    const songService = new SongService();
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
