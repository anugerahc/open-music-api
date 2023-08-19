const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/playlists/{id}',
        handler: (request, h) => handler.postExportPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
];

module.exports = routes;
