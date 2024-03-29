import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'

const cardStyle = {
    width: '99%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    height: '100%',
    maxHeight: '85%',
    display:'inline-block'
}

const commentBox = {
    width: '99%', 
    fontSize: '18pt', 
    backgroundColor: '#94a1e3', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    height: '88%',
    overflow: 'scroll',
    overflowX: 'hidden',
    display:'inline-block'
}

const textStyle = {
    width: '99%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    height: '12%',
    display:'inline-block'
}

const commentStyle = {
    borderStyle: 'solid', 
    borderWidth: 2,
    borderRadius: 1, 
    borderColor: '#000000',
    backgroundColor: '#c8c8fa',
    display: 'inline-block',
    height: 'auto',
    width: '99%',
    fontSize: 18
}

const textOverflow = {
    maxWidth: '99%',
    overflowWrap: 'break-word',
    display: 'inline-block',
    height: 'auto'
}

const Comments = () => {
    const {store} = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState("");
    const isLoggedIn = Boolean(auth.loggedIn);
    const [fullComments, setFullComments] = useState("")
    const isGuest = Boolean(auth.user === "guest")

    let commentsList = ""
    let isPublished = false;
    if(store.playingList) {
        console.log(store.playingList.published.isPublished)
        isPublished = store.playingList.published.isPublished;
    }
    
    function handleUpdateText(event) {
        setText(event.target.value)
    }

    function handleKeypress(event) {
        if (event.code === "Enter") {
            let id = store.playingList._id
            console.log(store.playingList)
            async function asyncComment(id) {
                if(text) {
                    let newComments = store.commentOnList(id, auth.user.userName, text);
                    setText("")
                    console.log("NEW COMMENTS")
                    console.log(newComments)
                }
            }
            asyncComment(id);
        }
    }

    let textField = ""
    if(isLoggedIn && isPublished && !isGuest) {
        console.log("TEXT FIELD VALID")
        textField = 
        <TextField
                required
                fullWidth
                label="Add Comment"
                autoComplete="Yah"
                onKeyPress = {handleKeypress}
                onChange = {handleUpdateText}
                value={text}
                />

    }

    
    if(store.playingList && isPublished) {
        commentsList =
        store.playingList.comments.map((comment, index) => (
            <Box sx={commentStyle}>
                <Typography mb={1} sx={{color:'blue'}}>  {comment.userName}</Typography>
                <Typography sx={textOverflow}>{comment.text}</Typography>
            </Box>
        ))
    }

    return (
        <Box style={cardStyle}>
            <Box style={commentBox}>
                {commentsList}
            </Box>
            <Box style={textStyle}>
            {textField}
            </Box>
        </Box>
        
    )
}

export default Comments;