import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import YoutubePlayer from './YoutubePlayer'
import Comments from './Comments'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

const boxStyle = { 
    width: '50%', 
    height: '3rem',
    fontSize: '20pt', 
    backgroundColor: '#eeeedd', 
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: 13,
    borderColor: '#000000',
    textAlign: 'center'
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

    if(playerOn === 1) {
        currentPlayer = <YoutubePlayer/>
    }
    else {
        currentPlayer = <Comments/>
    }

    return (
        <div id="youtube-wrapper" >
        <div className="container">
            <Box 
            style={boxStyle}
            onClick = {handlePlayerClick}
            >
                Player
            </Box>
            <Box 
            style={boxStyle}
            onClick = {handleCommentClick}
            >
                Comments
            </Box>
        </div>
         
         {currentPlayer}
        </div>
    )
}

export default YoutubeWrapper;