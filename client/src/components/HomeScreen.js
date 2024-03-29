import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid'

import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/

const cardStyle = {
    width: '100%', 
    fontSize: '18pt', 
    backgroundColor: '#eeeedd', 
    borderStyle: 'solid', 
    borderRight: 1, 
    borderRadius: 13, 
    borderColor: '#000000'
}

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let listCard = "";
    if (store) {
        let newList = store.idNamePairs
        listCard = 
            <List sx={{ width: '90%', left: '5%'}}>
            {
                newList.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        style={cardStyle}
                    />
                ))
            }
            </List>;
    }
    return (
        <Grid container spacing={0}>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
                { modalJSX }
            </div>
        </Grid>)
}

export default HomeScreen;