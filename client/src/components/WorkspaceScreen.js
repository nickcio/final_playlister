import { useContext, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#ffa387',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    store.history = useHistory();
    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let undoBtn = document.getElementById("undo-button")
    let redoBtn = document.getElementById("redo-button")

    let wholeSongs = "";

    function handleOk() {
        store.history.push("/")
    }

    if(auth.user && auth.user.email && store.currentList && store.currentList.ownerEmail){
        if(store.currentList.ownerEmail === auth.user.email) {
            console.log("MATCHES")
            wholeSongs = 
                <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper' }}
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
         </List> 
            
        }
        else{
            wholeSongs =
            <Alert sx={style} severity="error">
            <div
            id="account-error-modal"
            className="is-visible"
            data-animation="slideInOutLeft">
                <div>
                <header>
                        <AlertTitle>Unauthorized</AlertTitle>
                        You may not access this playlist.<br></br>
                        User has been logged out. Please click the home button.
                </header>
            </div>
            </div>
            </Alert>
        }
    }
    else{
        wholeSongs =
        <Alert sx={style} severity="error">
        <div
        id="account-error-modal"
        className="is-visible"
        data-animation="slideInOutLeft">
            <div>
            <header>
                    <AlertTitle>Unauthorized</AlertTitle>
                    You may not access this playlist.<br></br>
                    User has been logged out. Please click the home button.
            </header>
        </div>
        </div>
        </Alert>
    }

    const handleKeyDown = useCallback((e) => {
            if(e.ctrlKey === true) {
                console.log("Pressed CTRL")
                if(!e.repeat){
                    if(e.key === 'z') {
                        console.log("Pressed Z")
                        if(undoBtn) {
                            if(!undoBtn.disabled) {
                                undoBtn.click()
                            }
                        }
                    }else if(e.key === 'y') {
                        if(redoBtn) {
                            if(!redoBtn.disabled) {
                                redoBtn.click()
                            }
                        }
                    }
                }
            }
      }, []);

      useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
          };
      }, [handleKeyDown ]);
    
    return (
        <Box>
            { wholeSongs }
         { modalJSX }
         </Box>
    )
}

export default WorkspaceScreen;