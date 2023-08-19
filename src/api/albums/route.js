const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request, h) => handler.getAlbumByIdHandler(request, h),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request, h) => handler.editAlbumHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request, h) => handler.deleteAlbumHandler(request, h),
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: (request, h) => handler.postAlbumCoverHandler(request, h),
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512000,
            },
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.postAlbumLikeHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.deleteAlbumLikeHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.getAlbumLikeHandler(request, h),
    },
];

module.exports = routes;
