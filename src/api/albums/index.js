const AlbumHandler = require('./handler');
const routes = require('./route');

module.exports = {
    name: 'albums',
    version: '1.0.0',
    register: async (server, {albumService, storageService, validator}) => {
        const albumHandler = new AlbumHandler(albumService, storageService, validator);
        server.route(routes(albumHandler));
    },
};
