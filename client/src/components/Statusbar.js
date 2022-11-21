import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';


/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text ="";
    if (store.viewIsHome()) {
    console.log("IS HOME!")
    text = 
        <div id="list-selector-heading">
            <Fab 
            color="primary" 
            aria-label="add"
            id="add-list-button"
            onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
            <Typography variant="h2">Your Lists</Typography>
        </div>
    }
    else {
        text = "";
    }
    return (
        <div id="playlister-statusbar">
            { text }
        </div>
    );
}

export default Statusbar;