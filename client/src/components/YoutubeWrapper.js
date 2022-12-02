import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import YoutubePlayer from './YoutubePlayer'
import Comments from './Comments'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'


const boxStyle = { 
    width: '100%', 
    height: '3rem',
    fontSize: '20pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: 3,
    borderColor: '#000000',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    fontFamily: 'sans-serif'
    }

const boxStyleOff = { 
        width: '100%', 
        height: '3rem',
        fontSize: '20pt', 
        backgroundColor: '#a1a199', 
        borderStyle: 'solid',
        borderWidth: '2px',
        borderRadius: 3,
        borderColor: '#000000',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        fontFamily: 'sans-serif'
        }
    

const YoutubeWrapper = () => {
    const { store } = useContext(GlobalStoreContext);
    const [ playerOn, setPlayerOn ] = useState(1)

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    let currentPlayer = ""

    function handlePlayerClick() {
        setPlayerOn(1)
        console.log("ON")
    }
    function handleCommentClick() {
        setPlayerOn(0)
        console.log("OFF")
    }

    let commentBox = ""
    let playerBox = ""

    if(playerOn === 1) {
        currentPlayer = <YoutubePlayer/>
        commentBox = boxStyleOff
        playerBox = boxStyle
    }
    else {
        currentPlayer = <Comments/>
        commentBox = boxStyle
        playerBox = boxStyleOff
    }

    return (
        <div id="youtube-wrapper" >
        <Grid container spacing={0}>
            <Grid item xs={3} md={3}>
                <Box
                style={playerBox}
                onClick = {handlePlayerClick}
                >
                    Player
                </Box>
            </Grid>
            <Grid item xs={3} md={3}>
                <Box
                style={commentBox}
                onClick = {handleCommentClick}
                >
                    Comments
                </Box>
            </Grid>
        </Grid>
        <Box sx={{display: playerOn === 0 ? 'none' : 'visible'}}>
         <YoutubePlayer/>
        </Box>
        <Comments/>
        </div>
    )
}

export default YoutubeWrapper;