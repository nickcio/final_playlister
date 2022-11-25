import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/

const buttonStyle = {
    width: '100%', 
    height: '100%',
    fontSize: '10pt', 
    backgroundColor: '#6cc0f5', 
    borderStyle: 'solid', 
    borderWidth: 2,
    borderRadius: 3, 
    borderColor: 'black',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    cursor: 'pointer'
}

const buttonStyleDisabled = {
    width: '100%', 
    height: '100%',
    fontSize: '10pt', 
    backgroundColor: '#255c80', 
    borderStyle: 'solid', 
    borderWidth: 2,
    borderRadius: 3, 
    borderColor: 'black',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    cursor: 'default'
}

function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    return (
        <Grid container spacing={0.7}>
            <Grid item xs={2} md={2}>
                <Box
                    id='undo-button'
                    onClick={handleUndo}
                    style={(!store.canUndo() || store.modalOpen()) ? buttonStyleDisabled : buttonStyle}>
                    Undo
                </Box>
            </Grid>
            <Grid item xs={2} md={2}>
                <Box
                    id='redo-button'
                    onClick={handleRedo}
                    style={(!store.canRedo() || store.modalOpen()) ? buttonStyleDisabled : buttonStyle}>
                    Redo
                </Box>
            </Grid>
            <Grid item xs={2} md={2}></Grid>
            <Grid item xs={2} md={2}>
                <Box
                id='publish-button'
                style={buttonStyle}
                >
                    Publish
                </Box>
            </Grid>
            <Grid item xs={2} md={2}>
                <Box
                id='delete-list-button'
                style={buttonStyle}
                onClick={(event) => {
                    handleDeleteList(event, store.currentList._id)
                }}
                >
                    Delete
                </Box>
            </Grid>
            <Grid item xs={2} md={2}>
                <Box 
                    id='duplicate-button'
                    style={buttonStyle}>
                    Duplicate
                </Box>
            </Grid>
            
        </Grid>
    )
}

export default EditToolbar;