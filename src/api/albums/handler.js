const {mapDBToAlbumSongService} = require('../../utils/index');

class AlbumHandler {
    constructor(albumService, storageService, validator){
        this._albumService = albumService;
        this._storageService = storageService;
        this._validator = validator;
    }

    async postAlbumHandler(request, h) {
        const albumValidated = this._validator.validateAlbumPayload(request.payload);

        const albumId = await this._albumService.addAlbum(albumValidated);

        const response = h.response({
            status: 'success',
            data: {
                albumId: albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumByIdHandler(request, h) {
        const {id} = request.params;
        const album = await this._albumService.getAlbumById(id);

        const resultMappingAlbum = mapDBToAlbumSongService(album.album, album.songs);

        const response = h.response({
            status: 'success',
            data: {
                album: resultMappingAlbum,
            },
        });
        return response;
    }

    async editAlbumHandler(request, h) {
        const albumValidated = this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;

        await this._albumService.editAlbumById(id, albumValidated);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });
        return response;
    }

    async deleteAlbumHandler(request, h) {
        const {id} = request.params;

        await this._albumService.deleteAlbumById(id);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });
        return response;
    }

    async postAlbumCoverHandler(request, h) {
        const {cover} = request.payload;
        const {id} = request.params;

        await this._validator.validateAlbumCoverPayload(cover.hapi.headers);

        const coverUrl = await this._storageService.writeFile(cover, cover.hapi);

        await this._albumService.addCoverAlbum(id, coverUrl);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }

    async postAlbumLikeHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;

        await this._albumService.getAlbumById(id);

        await this._albumService.verifyExistUser(id, credentialId);
        
        await this._albumService.addAlbumLike(id, credentialId);

        const response = h.response({
            status: 'success',
            message: 'berhasil menyukai album',
        });
        response.code(201);
        return response;
    }

    async deleteAlbumLikeHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const {id} = request.params;
        
        await this._albumService.deleteAlbumLike(id, credentialId);

        const response = h.response({
            status: 'success',
            message: 'berhasil menyukai album',
        });
        response.code(200);
        return response;
    }

    async getAlbumLikeHandler(request, h) {
        const {id} = request.params;

        const result = await this._albumService.getAlbumLike(id);

        if (result.isCache == true) {
            const response = h.response({
                status: 'success',
                data: result.result,
            });
            response.header('X-Data-Source', 'cache');
            return response;
        }

        const response = h.response({
            status: 'success',
            data: result.result,
        });
        return response;
    }
};

module.exports = AlbumHandler;
