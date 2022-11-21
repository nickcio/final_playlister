import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SongCard from './SongCard.js';
import List from '@mui/material/List';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AddIcon from '@mui/icons-material/Add';
import EditToolbar from './EditToolbar';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

const cardStyle = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000'
}

const cardStyleOpen = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    cursor: 'default'
}

const inCard = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#94a1e3'
}

const songCardStyle = {
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 13, 
    borderColor: '#000000',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
}

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [listOpen, setListOpen] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    let userName = ""

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);
                
            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            setListOpen(true);
            console.log(listOpen)
        }
    }

    function handleAddNewSong() {
        store.addNewSong();
    }

    function handleCloseList() {
        store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={cardStyle}
            button
            onDoubleClick={handleToggleEdit}
        >
        <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize:'18pt' }}>{idNamePair.name}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize:'8pt' }}>By: {userName}</Typography>
            </Grid>
            <Grid item xs={11} md={11}></Grid>
            <Grid item xs={1} md={1}>
                <Box >
                    <IconButton onClick={(event) => {handleLoadList(event, idNamePair._id)}} aria-label='edit'>
                        <KeyboardDoubleArrowDownIcon style={{ fontSize:'18pt'}} />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
        </ListItem>

    if(store.currentList) {
        if(idNamePair._id === store.currentList._id) {
            console.log("SAME LISTS!!")
            cardElement = <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ height: '30rem', marginTop: '15px', p: 1 }}
                style={cardStyleOpen}
                button
                className='list-container'
            >
             <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ fontSize:'18pt' }}>{idNamePair.name}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ fontSize:'8pt' }}>By: {userName}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 44}}>
                    <Box className="inside-list" style={inCard}>
                        <List 
                        id="playlist-cards" 
                        sx={{ width: '100%' }}
                        >
                        {
                            store.currentList.songs.map((song, index) => (
                                <SongCard
                                    id={'playlist-song-' + (index)}
                                    key={'playlist-song-' + (index)}
                                    index={index}
                                    song={song}
                                />
                            ))  
                        }
                        <Box 
                        style={songCardStyle} 
                        className="list-card unselected-list-card"
                        disabled={!store.canAddNewSong() || store.modalOpen()}
                        onClick={handleAddNewSong}
                        >
                            <AddIcon/>
                        </Box>
                        </List> 
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <EditToolbar/>
                </Grid>
                <Grid item xs={11} md={11}></Grid>
                <Grid item xs={1} md={1}>
                    <Box >
                        <IconButton onClick={handleCloseList} aria-label='edit'>
                            <KeyboardDoubleArrowUpIcon style={{ fontSize:'18pt'}} />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
            </ListItem>
        }
    }

    if (editActive) {
        cardElement =
        <ListItem
        id={idNamePair._id}
        key={idNamePair._id}
        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        style={cardStyle}
        button
        onDoubleClick={handleToggleEdit}
    >
    <Grid container spacing={0}>
        <Grid item xs={6} md={6}>
        <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 18}}}
                InputLabelProps={{style: {fontSize: 18}}}
                autoFocus
                sx={{backgroundColor:'white', borderRadius:1}}
            />
        </Grid>
        <Grid item xs={12} md={12}>
            <Typography sx={{ fontSize:'8pt' }}>By:</Typography>
        </Grid>
        <Grid item xs={10} md={10}></Grid>
        <Grid item xs={1} md={1}>
            <Box >
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'18pt'}} />
                </IconButton>
            </Box>
        </Grid>
        <Grid item xs={1} md={1}>
            <Box >
                <IconButton onClick={(event) => {handleLoadList(event, idNamePair._id)}} aria-label='edit'>
                    <KeyboardDoubleArrowDownIcon style={{ fontSize:'18pt'}} />
                </IconButton>
            </Box>
        </Grid>
    </Grid>
    </ListItem>
            
    }
    return (
        cardElement
    );
}

export default ListCard;