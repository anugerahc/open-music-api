class ExportHandler {
    constructor(exportService, playlistService, validator) {
        this._exportService = exportService;
        this._playlistService = playlistService;
        this._validator = validator;
    }

    async postExportPlaylistHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const playlistId = request.params;

        const exportValidated = this._validator.validateExportPlaylistPayload(request.payload);
        await this._playlistService.verifyPlaylistOwner(playlistId.id, credentialId);

        const message = {
            playlistId: playlistId.id,
            targetEmail: exportValidated.targetEmail,
        };

        await this._exportService.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
        });
        response.code(201);
        return response;

    }
}

module.exports = ExportHandler;
