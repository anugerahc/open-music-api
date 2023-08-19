/* eslint-disable key-spacing */
/* eslint-disable camelcase */
const mapDBToModel = ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    album_id,
}) => ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    albumId : album_id,
});

const mapDBToAlbumSongService = ({
    id, 
    name, 
    cover,
    year, 
}, song) => ({
    id, 
    name,
    coverUrl: (cover === null) ? null : cover, 
    year, 
    songs: song,
});

const mapDBToPlaylistSong = (playlistData, songData) => ({
    playlist: {
        id: playlistData.id,
        name: playlistData.name,
        username: playlistData.username,
        songs: songData,
    },
});

const mapDBToPlalistActivity = (playlistId, activities) => ({
    playlistId: playlistId,
    activities: activities,
});

const mapDBToAlbumLike = (count) => ({
    likes: parseInt(count),
});

const mapSongList = ({id, title, performer}) => ({
    id: id,
    title: title,
    performer: performer,
});

module.exports = {mapDBToModel, mapDBToAlbumSongService, mapDBToPlaylistSong, mapDBToPlalistActivity, mapDBToAlbumLike, mapSongList};
