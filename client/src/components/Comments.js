import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const cardStyle = {
    width: '99%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeeff', 
    borderStyle: 'solid', 
    borderWidth: 3,
    borderRadius: 1, 
    borderColor: '#000000',
    height: '86%'
}

const Comments = () => {
    return (
        <Box style={cardStyle}>
            Comments
        </Box>
    )
}

export default Comments;