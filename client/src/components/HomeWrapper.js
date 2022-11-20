import React, { useContext } from 'react'

import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import PlaylistsWrapper from './PlaylistsWrapper'
import YoutubeWrapper from './YoutubeWrapper'
import Grid from '@mui/material/Grid';

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (auth.loggedIn) {
        return <div id="home-wrapper">
                <div>
                    <PlaylistsWrapper />
                </div>
                <div>
                    <YoutubeWrapper/>
                </div>
            </div>
    }
    else
        return <SplashScreen />
}