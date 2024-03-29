/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlist/:email/:name', auth.verify, PlaylistController.getPlaylistByName)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlistpairs/:name', auth.verify, PlaylistController.getPlaylistPairsByLists)
router.get('/playlistpairs/:userName', auth.verify, PlaylistController.getPlaylistPairsByUser)
router.get('/playlists', PlaylistController.getPlaylists)
router.put('/playlist/:id', PlaylistController.updatePlaylist)

module.exports = router