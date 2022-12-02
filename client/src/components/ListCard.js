import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import api from '../store/store-request-api'
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
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddIcon from '@mui/icons-material/Add';
import EditToolbar from './EditToolbar';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

const cardPlayingStyle = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#329ea8', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000'
}

const cardPlayingStyleOpen = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#329ea8', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    cursor: 'default'
}

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

const publishedCardStyle = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#c8c8fa', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000'
}

const publishedCardStyleOpen = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#c8c8fa', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    cursor: 'default'
}

const inCard = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#94a1e3',
    overflowX: 'hidden'
}

const publishInCard = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#1f1f78',
    color: '#c8c8fa',
    overflowX: 'hidden'
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

const textFieldGood = {
    backgroundColor:'white', 
    borderRadius:1,
    fontSize:'15pt'
}

const textFieldBad = {
    backgroundColor:'#faaba5', 
    borderRadius:1,
    borderColor:'red'
}

const thumbStyle = {
    color: 'black',
    fontSize: '18pt'
}

const thumbStyleClicked = {
    color: 'blue',
    fontSize: '18pt'
}

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [listOpen, setListOpen] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const [labelName, setLabelName] = useState("Playlist Name")
    const [textStyle, setTextStyle] = useState(textFieldGood)
    const isGuest = Boolean(auth.user === "guest")
    let isOwner = Boolean(auth.user.email === idNamePair.playlist.ownerEmail)
    let published = idNamePair.playlist.published.isPublished;
    let listId = idNamePair.playlist._id

    let isPlaying = false
    if(store.playingList && store.playingList._id === idNamePair._id) {
        isPlaying = true;
    }
    let thumbUpStyle = thumbStyle
    if(idNamePair.playlist.likeList.includes(auth.user.email)) {
        console.log("LIKER")
        thumbUpStyle = thumbStyleClicked
    }

    let thumbDownStyle = thumbStyle
    if(idNamePair.playlist.dislikeList.includes(auth.user.email)) {
        console.log("DISLIKER")
        thumbDownStyle = thumbStyleClicked
    }

    let userName = ""
    if(idNamePair.playlist.userName){
        userName = idNamePair.playlist.userName;
    }
    let likes = 0;
    if(idNamePair.playlist.likes){
        likes = idNamePair.playlist.likes
    }
    let dislikes = 0;
    if(idNamePair.playlist.dislikes){
        dislikes = idNamePair.playlist.dislikes;
    }
    let listens = 0;
    if(idNamePair.playlist.listens){
        listens = idNamePair.playlist.listens;
    }
    let publishDate = "";
    if(idNamePair.playlist.published.publishDate){
        published = true;
        publishDate = (new Date(idNamePair.playlist.published.publishDate)).toDateString().substring(3);
    }


    let thumbUp = "";

    function handleLoadList(event, id) {
        event.stopPropagation();
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

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }

    function handleCloseList(event) {
        event.stopPropagation()
        store.closeCurrentList();
    }

    function handlePlay() {
        console.log("PLAYING 0")
        store.setPlayingList(listId)
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        if(!published && isOwner) {
            event.stopPropagation();
            toggleEdit();
        }
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
            let currentName = idNamePair.name
            let id = event.target.id.substring("list-".length);
            async function asyncEdit(id) {
                if(text) {
                    let response = await api.getPlaylistByName(text,auth.user.email)
                    if(response.data.success && currentName !== text){
                        setLabelName("Warning: That name is already taken.")
                        console.log(labelName)
                        setTextStyle(textFieldBad)
                    }
                    else{
                        store.changeListName(id, text);
                        toggleEdit();
                        setLabelName("Playlist Name")
                        setTextStyle(textFieldGood)
                    }
                }
                else {
                    toggleEdit()
                    setLabelName("Playlist Name")
                    setTextStyle(textFieldGood)
                }
            }
            asyncEdit(id);
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value)
        setLabelName("Playlist Name")
        setTextStyle(textFieldGood)
    }

    function handleLike(event) {
        event.stopPropagation()
        if(!isGuest) {
            console.log("LIKING")
            store.likeList(idNamePair._id, auth.user.email)
        }
    }

    function handleDislike(event) {
        event.stopPropagation()
        if(!isGuest) {
            console.log("DISLIKING")
            store.dislikeList(idNamePair._id, auth.user.email)
        }
    }

    let addSongCard = 
        <Box 
            style={songCardStyle} 
            className="list-card unselected-list-card"
            disabled={!store.canAddNewSong() || store.modalOpen()}
            onClick={handleAddNewSong}
        >
            <AddIcon/>
        </Box>
    if(published) {
        addSongCard = ""
    }
    let cardsList = ""
    if(store.currentList) {
        cardsList =
        store.currentList.songs.map((song, index) => (
            <SongCard
                id={'playlist-song-' + (index)}
                key={'playlist-song-' + (index)}
                index={index}
                song={song}
                published={published}
            />
        ))
    if(published) {
        cardsList =
        store.currentList.songs.map((song, index) => (
            <Typography sx={{ml:2, overflowX: 'hidden'}}>{index + 1}. {song.title} by {song.artist}</Typography>
        ))
    }
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
            style={isPlaying ? cardPlayingStyle : (published ? publishedCardStyle : cardStyle) }
            button
            onClick={handlePlay}
            onDoubleClick={handleToggleEdit}
        >
        <Grid container spacing={0}>
            <Grid item xs={8} md={8}>
                <Typography sx={{ fontSize:'18pt' }}>{idNamePair.name}</Typography>
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography onClick={(event) => {handleLike(event)}} >{published ? <ThumbUpIcon sx={thumbUpStyle}/> : ""}</Typography>
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography sx={{ fontSize:'10pt', fontWeight:'bold' }}>{published ? likes : ""}</Typography>
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography onClick={(event) => {handleDislike(event)}} >{published ? <ThumbDownIcon sx={thumbDownStyle}/> : ""}</Typography>
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography sx={{ fontSize:'10pt', fontWeight:'bold' }}>{published ? dislikes : ""}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize:'8pt' }}>By: {userName}</Typography>
            </Grid>
            <Grid item xs={8} md={8}>
                <Typography sx={{ mt: 2, fontSize:'10pt', fontWeight:'bold' }}>{published ? "Published:" : ""} {publishDate}</Typography>
            </Grid>
            <Grid item xs={3} md={3}>
                <Typography sx={{ mt: 2, fontSize:'10pt', fontWeight:'bold' }}>{published ? "Listens:" : ""} {published ? listens : ""}</Typography>
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

    if(store.currentList) {
        if(idNamePair._id === store.currentList._id) {
            console.log("SAME LISTS!!")
            cardElement = <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ height: '30rem', marginTop: '15px', p: 1 }}
                style={isPlaying ? cardPlayingStyleOpen : (published ? publishedCardStyleOpen : cardStyleOpen)}
                button
                onClick={handlePlay}
                className='list-container'
            >
             <Grid container spacing={0}>
                <Grid item xs={8} md={8}>
                    <Typography sx={{ fontSize:'18pt' }}>{idNamePair.name}</Typography>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography onClick={(event) => {handleLike(event)}} sx={{ fontSize:'18pt' }}>{published ? <ThumbUpIcon sx={thumbUpStyle}/> : ""}</Typography>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography sx={{ fontSize:'10pt', fontWeight:'bold' }}>{published ? likes : ""}</Typography>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography onClick={(event) => {handleDislike(event)}} sx={{ fontSize:'18pt' }}>{published ? <ThumbDownIcon sx={thumbDownStyle}/> : ""}</Typography>
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography sx={{ fontSize:'10pt', fontWeight:'bold' }}>{published ? dislikes : ""}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ fontSize:'8pt' }}>By: {userName}</Typography>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 44}}>
                    <Box className="inside-list" style={published ? publishInCard : inCard}>
                        <List 
                        id="playlist-cards" 
                        sx={{ width: '100%', overflowX: 'hidden' }}
                        >
                        {
                            cardsList
                        }
                        { addSongCard }
                        </List> 
                    </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                    <EditToolbar id={idNamePair._id} published={published} email={idNamePair.playlist.ownerEmail}/>
                </Grid>
                <Grid item xs={8} md={8}>
                    <Typography sx={{ mt: 2, fontSize:'10pt', fontWeight:'bold' }}>{published ? "Published:" : ""} {publishDate}</Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Typography sx={{ mt: 2, fontSize:'10pt', fontWeight:'bold' }}>{published ? "Listens:" : ""} {published ? listens : ""}</Typography>
                </Grid>
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
                label={labelName}
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {textStyle}}}
                InputLabelProps={{style: {textStyle}}}
                autoFocus
            />
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
            
    }
    return (
        cardElement
    );
}

export default ListCard;