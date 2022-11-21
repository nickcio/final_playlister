import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import Box from '@mui/system/Box';


/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text ="";
    if(auth.user) {
        if (store.viewIsHome()) {
        console.log("IS HOME!")
        text = 
            <Box  sx={{ mt: 4 }} id="list-selector-heading">
                <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </Box>
        }
    }
    else {
        text = "";
    }
    return (
        <Box id="playlister-statusbar">
            { text }
        </Box>
    );
}

export default Statusbar;