import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const cardStyle = {
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 13, 
    borderColor: '#000000',
    fontSize: 18
}

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            console.log("CUAMO")
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
            style={cardStyle}
        >
            <Grid container spacing={0}>
                <Grid item xs={1} md={1}>
                    {index + 1}.
                </Grid>
                <Grid item xs={10} md={10}>
                    <a
                        id={'song-' + index + '-link'}
                        className="song-link"
                        href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                        {song.title} by {song.artist}
                    </a>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Box >
                        <IconButton onClick={handleRemoveSong} aria-label='edit'>
                            <CloseIcon style={{ fontSize:'14pt', color:'white'}} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default SongCard;