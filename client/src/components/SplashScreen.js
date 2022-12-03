import React, { useContext, createContext, useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Logo from '../PlaylisterIcon.png'

const buttonStyle = {
    width: '150px', 
    height: '50px',
    marginLeft: '50px',
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

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const isGuest = Boolean(auth.user === "guest")

    function handleGuest() {
        store.viewToAll()
        auth.continueAsGuest()
    }

    return (
        <Grid container spacing={0} id="splash-screen">
            <Grid item xs={2} md={12} sx={{mt:10}}>
                <Typography style={{fontSize: '18pt', fontStyle: 'italic'}}>Welcome To</Typography>
                <Typography style={{fontSize: '5vw', fontStyle: 'italic'}}><img src={Logo}/></Typography>
                <Typography style={{fontSize: '18pt' }}>Playlister: The number one place to create, edit, and play playlists!<br/>Add your favorite songs and share them with others!</Typography>
            </Grid>
            <Grid item xs={2} md={2}></Grid>
            <Grid item xs={2} md={2}>
                <Link to='/login/'><Box style={buttonStyle}>Login</Box></Link>
            </Grid>
            <Grid item xs={2} md={1}></Grid>
            <Grid item xs={2} md={2}>
                <Link to='/register/'><Box style={buttonStyle}>Register</Box></Link>
            </Grid>
            <Grid item xs={2} md={1}></Grid>
            <Grid item xs={2} md={2}>
                <Box onClick={handleGuest} style={buttonStyle}>Continue as Guest</Box>
            </Grid>
            <Grid item xs={2} md={2}></Grid>
            <Grid item xs={2} md={2}>
            <Typography sx={{mt:15}} style={{fontSize: '11pt', fontStyle: 'italic'}}>Nicholas Ciotoli, CSE 316 Fall 2022</Typography>
            </Grid>
        </Grid>
    )
}