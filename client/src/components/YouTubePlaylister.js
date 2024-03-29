import React, { useContext, useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import Button from '@mui/material/Button'
import { cardMediaClasses } from '@mui/material';

const size = {
  transform:"scale(1.8)"  
}

const gridSize = {
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
}

const cardStyle = {
  width: '99%', 
  fontSize: '18pt', 
  backgroundColor: '#eeeeff', 
  borderStyle: 'solid', 
  borderWidth: 3,
  borderRadius: 1, 
  borderColor: '#000000',
  height: '400%'
}

const cardStyle2 = {
  width: '99%', 
  fontSize: '18pt', 
  backgroundColor: '#eeeeff', 
  borderStyle: 'solid', 
  borderWidth: 3,
  borderRadius: 1, 
  borderColor: '#000000',
  height: '335%',
  
}

const centerd = {
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
}


export default function YouTubePlaylister() {
  const { store } = useContext(GlobalStoreContext);
  const [songId, setSongId] = useState(0)
  const playerX = useRef(null)
    let player = ""
    if(playerX) {
      console.log("PLAUYER X EXISTS")
      console.log(playerX)
      player = playerX.current
      console.log(player)
    }
    let currentSongObj = "";
    let newSongX = {name: "", num: "", art: ""}
    let youTubeIds = [];
    let songInfos = [];
    if(store.playingList) {
      for(const song of store.playingList.songs) {
        youTubeIds.push(song.youTubeId)
        songInfos.push(song)
      }
    }
    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = youTubeIds

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;
    if(store.playingList) {
      currentSongObj = songInfos[currentSong]
      console.log("CURRENT SONG OBJ")
      console.log(currentSongObj)
    }
    const playerOptions = {
        height: '320',
        width: '620',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT

    function rewind() {
      decSong()
      loadAndPlayCurrentSong()
    }

    function pauseSong() {
      player.pauseVideo()
    }

    function playSong() {
      player.playVideo()
    }

    function skip() {
      incSong()
      loadAndPlayCurrentSong()
    }

    function loadAndPlayCurrentSong() {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        if(songInfos && currentSongObj) {
        currentSongObj = songInfos[currentSong]
        //setSongX({name: currentSongObj.title, num: currentSong+1, art: currentSongObj.artist})
        }
        
      }

    let rwdButton = ""
    let stopButton = ""
    let playButton = ""
    let fwdButton = ""
    let currentPlaylistName = "";
    if(store.playingList) {
        currentPlaylistName = store.playingList.name
        currentSongObj = songInfos[currentSong]
        rwdButton = <FastRewindIcon sx={size}/>
        stopButton = <StopIcon sx={size}/>
        playButton = <PlayArrowIcon sx={size}/>
        fwdButton = <FastForwardIcon sx={size}/>
    }
    if(currentSongObj) {
      newSongX = {name: currentSongObj.title, num: currentSong, art: currentSongObj.artist}
        
    }
    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
      console.log("FIRST INDEX BEFORE INCREASE")
      console.log(currentSong)
        currentSong++;
        currentSong = currentSong % playlist.length
        console.log("FIRST INDEX AFTER INCREASE")
        console.log(currentSong)
    }

    function decSong() {
      console.log("FIRST INDEX BEFORE DECREASE")
      console.log(currentSong)
      currentSong--;
      if(currentSong <= -1) {
        currentSong = playlist.length - 1
      }
      console.log("FIRST INDEX AFTER DECREASE")
      console.log(currentSong)
  }

    function onPlayerReady(event) {
      player = event.target
      playerX.current = player
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        player = event.target
        playerX.current = player
        console.log("PLAYEER!!")
      console.log(player)
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
        document.getElementById("current-song-id").innerHTML = "Song: #" + (currentSong + 1);
        if(store.playingList && store.playingList.songs && store.playingList.songs[currentSong]) {
        document.getElementById("current-song-title").innerHTML = "Title: " + (store.playingList.songs[currentSong].title);
        }else{
          document.getElementById("current-song-title").innerHTML = "Title: "
        }
        if(store.playingList && store.playingList.songs && store.playingList.songs[currentSong]) {
          document.getElementById("current-song-artist").innerHTML = "Artist: " + (store.playingList.songs[currentSong].artist);
          }else{
            document.getElementById("current-song-artist").innerHTML = "Artist: "
          }
    }

    return (<Box>
            <Box style={cardStyle} sx={{disabled:'true', pointerEvents:'none'}}>
              <YouTube
                  videoId={playlist[currentSong]}
                  opts={playerOptions}
                  onReady={onPlayerReady}
                  onStateChange={onPlayerStateChange} 
                  disabled
                  ref={player}
                  pointerEvents='None'/>
                  
              </Box>
            <Box style={cardStyle2}>
            <Typography>Playlist: {currentPlaylistName}</Typography>
            <Typography id="current-song-id">Song: </Typography>
            <Typography id="current-song-title">Title: </Typography>
            <Typography id="current-song-artist">Artist: </Typography>
            <Grid container spaching={0.7} mt={1.5} mb={2.5} sx={[cardStyle,centerd,{display: store.playingList ? 'visible' : 'none'}]}>
                <Grid item xs={2} md={2}/>
                <Grid item xs={2} md={2} sx={[gridSize,cardStyle2]}>
                <Button onClick={rewind}>
                  {rwdButton}
                  </Button>
                </Grid>
                <Grid item xs={2} md={2} sx={[gridSize,cardStyle2]}>
                <Button onClick={pauseSong}>
                  {stopButton}
                  </Button>
                </Grid>
                <Grid item xs={2} md={2} sx={[gridSize,cardStyle2]}>
                <Button onClick={playSong}>
                  {playButton}
                  </Button>
                </Grid>
                <Grid item xs={2} md={2} sx={[gridSize,cardStyle2]}>
                  <Button onClick={skip}>
                  {fwdButton}
                  </Button>
                </Grid>
                <Grid item xs={2} md={2}/>
            </Grid>
            </Box>
        </Box>)
}