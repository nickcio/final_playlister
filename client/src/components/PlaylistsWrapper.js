import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import HomeScreen from './HomeScreen.js'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export default function PlaylistsWrapper() {
    const { store } = useContext(GlobalStoreContext);
    
    let screenView = <Grid >
        <HomeScreen />
    </Grid>

    return screenView
}