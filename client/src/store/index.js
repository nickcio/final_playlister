import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    UNMARK_LIST: "UNMARK_LIST",
    ACCOUNT_ERROR: "ACCOUNT_ERROR",
    CHANGE_VIEW: "CHANGE_VIEW",
    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    SET_SORT_TYPE: "SET_SORT_TYPE",
    SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
    COMMENT: "COMMENT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

const CurrentView = {
    NONE : "NONE",
    HOME_SCREEN : "HOME_SCREEN",
    ALL_LISTS : "ALL_LISTS",
    USER_LISTS : "USER_LISTS"
}

const CurrentSort = {
    NAME: "NAME",
    PUBLISH_DATE: "PUBLISH_DATE",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES",
    CREATED: "CREATED",
    EDITED: "EDITED"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        currentView : CurrentView.HOME_SCREEN,
        currentSort : CurrentSort.CREATED,
        idNamePairs: [],
        currentList: null,
        playingList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        errorMessage: "",
        allPlaylists: []
    });
    const history = useHistory();
    const [lastSort, setLastSort] = useState(CurrentSort.CREATED);
    const [search, setSearch] = useState("");

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: payload.allPlaylists
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: payload.allPlaylists
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.UNMARK_LIST: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.CHANGE_VIEW: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : payload.view,
                    currentSort : store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: store.allPlaylists
                });
            }
            case GlobalStoreActionType.SET_SORT_TYPE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : payload.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: payload.allPlaylists
                });
            }
            case GlobalStoreActionType.COMMENT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    currentView : store.currentView,
                    currentSort : store.currentSort,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    playingList: store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    errorMessage: "",
                    allPlaylists: payload.allPlaylists
                });
            }
            default:
                return store;

        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        // GET THE LIST
        console.log("RENAMING")
        console.log(store.currentSort)
        let exists = await api.getPlaylistByName(newName,auth.user.email);
        if(!exists.data.success){
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                                let allLists = response.data.playlists;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        allPlaylists: allLists
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    store.checkForList = async function (name) {
        let exists = await api.getPlaylistByName(name,auth.user.email)
        console.log("EXISTS?" + exists.data.success)
        if(exists.data.success) {
            console.log(exists.data.playlist)
        }
        return exists.data.success
    }

    store.duplicateList = function (id) {
        console.log("DUPLICATING")

        async function asyncDupeList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let newListName = playlist.name;

                let exists = await api.getPlaylistByName(newListName,auth.user.email);
                if(exists.data.success){
                    let i = 0;
                    let newerListName = newListName
                    while(exists.data.success){
                        newerListName = newListName + " " + i
                        exists = await api.getPlaylistByName(newerListName,auth.user.email);
                        i = i + 1;
                    }
                    newListName = newerListName
                }
                response = await api.createPlaylist(newListName, playlist.songs, auth.user.email, auth.user.userName, 0, 0, 0, [], [], []);
                console.log("createNewList response: " + response);
                if (response.status === 201) {
                    tps.clearAllTransactions();
                    store.chooseLoadPairsKeepCurrent()
                    // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                }
                else {
                    console.log("API FAILED TO CREATE A NEW LIST");
                }
            }
        }
        asyncDupeList(id);
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled 0";
        console.log("USERNAME")
        console.log(auth.user)
        console.log("SORT AT BEGINNING OF CREATE")
        console.log(store.currentSort)
        //Duplicate name check
        let exists = await api.getPlaylistByName(newListName,auth.user.email);
        if(exists.data.success){
            let i = 1;
            let newerListName = newListName
            while(exists.data.success){
                newerListName = "Untitled " + i
                exists = await api.getPlaylistByName(newerListName,auth.user.email);
                i = i + 1;
            }
            newListName = newerListName
        }
        let response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.userName, 0, 0, 0, [], [], []);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            console.log("NEW LIST FIRST")
            console.log(newList)
            async function getListPairs(playlist) {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                    let allLists = response.data.playlists;
                    console.log("NEW LIST")
                    console.log(playlist)
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            idNamePairs: pairsArray,
                        }
                    });
                }
            }
            getListPairs(newList);
            console.log("SORT TYPE AFTER MAKING NEW LIST:")
            console.log(store.currentSort)
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.publishList = function (id) {
        console.log("PUBLISHING")
        console.log(store.currentSort)
        async function asyncPublish(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = {isPublished: true, publishDate: (new Date()).toISOString()};
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                                let allLists = response.data.playlists;
                                console.log(allLists)
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        allPlaylists: allLists
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublish(id);
    }

    store.loadIdNamePairsByList = function (name) {
        setSearch(name)
        console.log("BY LIST")
        async function asyncLoadIdNamePairsByList(name) {
            console.log("SEARCHING BY NAME 2: " + name)
            const response = await api.getPlaylists();
            if (response.data.success && name !== "") {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished === true);
                pairsArray = pairsArray.filter((pair) => pair.name.includes(name));
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
        asyncLoadIdNamePairsByList(name);
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        setSearch("")
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.loadIdNamePairsByUser = function (userName) {
        setSearch(userName)
        async function asyncLoadIdNamePairsByUser(userName) {
            console.log("called this one, the user")
            const response = await api.getPlaylists();
            if (response.data.success && userName !== "") {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished);
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                pairsArray = pairsArray.filter((pair) => pair.playlist.userName.includes(userName));
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
        asyncLoadIdNamePairsByUser(userName);
    }

    store.chooseLoadPairs = async function () {
        if(store.viewIsHome()) {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        else if(store.viewIsAll()) {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished === true);
                pairsArray = pairsArray.filter((pair) => pair.name.includes(search));
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
        else if(store.viewIsUser()) {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished);
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                pairsArray = pairsArray.filter((pair) => pair.playlist.userName.includes(search));
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
    }

    store.chooseLoadPairsKeepCurrent = async function () {
        if(store.viewIsHome()) {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.COMMENT,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists,
                        currentList: store.currentList
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        else if(store.viewIsAll()) {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished === true);
                pairsArray = pairsArray.filter((pair) => pair.name.includes(search));
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.COMMENT,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists,
                        currentList: store.currentList
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
        else if(store.viewIsUser()) {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished);
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                pairsArray = pairsArray.filter((pair) => pair.playlist.userName.includes(search));
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.COMMENT,
                    payload: {
                        idNamePairs: pairsArray,
                        playlists: allLists,
                        currentList: store.currentList
                    }
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: [],
                        playlists: []
                    }
                });
            }
        }
    }

    store.getSearchQuery = function() {
        return search
    }

    store.commentOnList = function(id, userName, text) {
        async function asyncComment(id, userName, text) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let comments = playlist.comments;
                comments.push({userName: userName, text: text});
                playlist.comments = comments;
                console.log("COMMENTS:")
                console.log(comments)
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        if(store.viewIsHome()) {
                            const response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                                let allLists = response.data.playlists;
                                console.log("CURRENT SORT NOW BEFORE LOAD::")
                                console.log(store.currentSort)
                                storeReducer({
                                    type: GlobalStoreActionType.COMMENT,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlists: allLists,
                                        currentList: playlist
                                    }
                                });
                                console.log("CURRENT SORT NOW AFTER LOAD::")
                                console.log(store.currentSort)
                            }
                            else {
                                console.log("API FAILED TO GET THE LIST PAIRS");
                            }
                        }
                        else if(store.viewIsAll()) {
                            const response = await api.getPlaylists();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished === true);
                                pairsArray = pairsArray.filter((pair) => pair.name.includes(search));
                                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                                let allLists = response.data.playlists;
                                console.log("CURRENT SORT NOW BEFORE LOAD::")
                                console.log(store.currentSort)
                                storeReducer({
                                    type: GlobalStoreActionType.COMMENT,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlists: allLists,
                                        currentList: playlist
                                    }
                                });
                                console.log("CURRENT SORT NOW AFTER LOAD::")
                                console.log(store.currentSort)
                            }
                            else {
                                storeReducer({
                                    type: GlobalStoreActionType.COMMENT,
                                    payload: {
                                        idNamePairs: [],
                                        playlists: [],
                                        currentList: null
                                    }
                                });
                            }
                        }
                        else if(store.viewIsUser()) {
                            const response = await api.getPlaylists();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished);
                                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                                pairsArray = pairsArray.filter((pair) => pair.playlist.userName.includes(search));
                                let allLists = response.data.playlists;
                                console.log("CURRENT SORT NOW BEFORE LOAD::")
                                console.log(store.currentSort)
                                storeReducer({
                                    type: GlobalStoreActionType.COMMENT,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlists: allLists,
                                        currentList: playlist
                                    }
                                });
                                console.log("CURRENT SORT NOW AFTER LOAD::")
                                console.log(store.currentSort)
                            }
                            else {
                                storeReducer({
                                    type: GlobalStoreActionType.COMMENT,
                                    payload: {
                                        idNamePairs: [],
                                        playlists: [],
                                        currentList: null
                                    }
                                });
                            }
                        }
                    }
                }
                updateList(playlist);
                return comments;
            }
        }
        asyncComment(id, userName, text);
    }

    store.comparator = function (pred) {
        let func = function (a,b) {
            if(pred(a,b)) return 1
            if(pred(b,a)) return -1
            return 0
        }
        return func
    }

    store.getSortTypeAlt = function(sortType) {
        console.log("CURRENT SORT TYPE AFTER CALLING:")
        console.log(sortType)
        if(!sortType) {
            console.log("UNDEFINED DETECTED!")
            sortType= lastSort;
            console.log(lastSort)
        }
        if(sortType === CurrentSort.PUBLISH_DATE) {
            let publishD = function (a,b) {
                if(a.playlist.published.isPublished && b.playlist.published.isPublished) {
                    let aInt = Date.parse(a.playlist.published.publishDate);
                    let bInt = Date.parse(b.playlist.published.publishDate);
                    return aInt < bInt
                }
                if(a.playlist.published) {
                    let aInt = Date.parse(a.playlist.published.publishDate);
                    return 0 > aInt;
                }
                if(b.playlist.published) {
                    let bInt = Date.parse(b.playlist.published.publishDate);
                    return 0 > bInt;
                }
                return Date.parse(a.playlist.createdAt) < Date.parse(b.playlist.createdAt)
            }
            return publishD;
        }
        if(sortType === CurrentSort.NAME) {
            return ((a,b) => a.name.toLowerCase() > b.name.toLowerCase());
        }
        if(sortType === CurrentSort.LISTENS) {
            return ((a,b) => a.playlist.listens < b.playlist.listens);
        }
        if(sortType === CurrentSort.LIKES) {
            return ((a,b) => a.playlist.likes < b.playlist.likes);
        }
        if(sortType === CurrentSort.DISLIKES) {
            return ((a,b) => a.playlist.dislikes < b.playlist.dislikes);
        }
        if(sortType === CurrentSort.CREATED) {
            return ((a,b) => Date.parse(a.playlist.createdAt) > Date.parse(b.playlist.createdAt))
        }
        if(sortType === CurrentSort.EDITED) {
            return ((a,b) => Date.parse(a.playlist.updatedAt) < Date.parse(b.playlist.updatedAt))
        }
        return ((a,b) => a.name.toLowerCase() < b.name.toLowerCase());
    }

    store.getSortType = function() {
        console.log("CURRENT SORT:")
        console.log(store.currentSort)
        return store.getSortTypeAlt(store.currentSort)
    }

    store.setSortType = function(id) {
        let sortType = CurrentSort.PUBLISH_DATE;
        if(id === 0) {
            console.log("SET TO NAME 2")
            sortType = CurrentSort.NAME;
        }
        if(id === 1) {
            console.log("SET TO DATE")
        }
        if(id === 2) {
            sortType = CurrentSort.LISTENS;
        }
        if(id === 3) {
            sortType = CurrentSort.LIKES;
        }
        if(id === 4) {
            sortType = CurrentSort.DISLIKES;
        }
        if(id === 5) {
            sortType = CurrentSort.CREATED;
        }
        if(id === 6) {
            sortType = CurrentSort.EDITED;
        }
        console.log("SETTING LASTSORT TO")
        console.log(sortType)
        setLastSort(sortType);
        console.log(store.currentSort)
        console.log(sortType)
        async function asyncLoadIdNamePairs() {
            if(store.viewIsHome()) {
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray.sort(store.comparator(store.getSortTypeAlt(sortType)))
                    let allLists = response.data.playlists;
                    console.log("CURRENT SORT NOW BEFORE LOAD::")
                    console.log(store.currentSort)
                    storeReducer({
                        type: GlobalStoreActionType.SET_SORT_TYPE,
                        payload: {
                            idNamePairs: pairsArray,
                            playlists: allLists,
                            currentSort: sortType
                        }
                    });
                    console.log("CURRENT SORT NOW AFTER LOAD::")
                    console.log(store.currentSort)
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            else if(store.viewIsAll()) {
                const response = await api.getPlaylists();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished === true);
                    pairsArray = pairsArray.filter((pair) => pair.name.includes(search));
                    pairsArray.sort(store.comparator(store.getSortTypeAlt(sortType)))
                    let allLists = response.data.playlists;
                    console.log("CURRENT SORT NOW BEFORE LOAD::")
                    console.log(store.currentSort)
                    storeReducer({
                        type: GlobalStoreActionType.SET_SORT_TYPE,
                        payload: {
                            idNamePairs: pairsArray,
                            playlists: allLists,
                            currentSort: sortType
                        }
                    });
                    console.log("CURRENT SORT NOW AFTER LOAD::")
                    console.log(store.currentSort)
                }
                else {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: {
                            idNamePairs: [],
                            playlists: []
                        }
                    });
                }
            }
            else if(store.viewIsUser()) {
                const response = await api.getPlaylists();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = pairsArray.filter((pair) => pair.playlist.published.isPublished);
                    pairsArray.sort(store.comparator(store.getSortTypeAlt(sortType)))
                    pairsArray = pairsArray.filter((pair) => pair.playlist.userName.includes(search));
                    let allLists = response.data.playlists;
                    console.log("CURRENT SORT NOW BEFORE LOAD::")
                    console.log(store.currentSort)
                    storeReducer({
                        type: GlobalStoreActionType.SET_SORT_TYPE,
                        payload: {
                            idNamePairs: pairsArray,
                            playlists: allLists,
                            currentSort: sortType
                        }
                    });
                    console.log("CURRENT SORT NOW AFTER LOAD::")
                    console.log(store.currentSort)
                }
                else {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: {
                            idNamePairs: [],
                            playlists: []
                        }
                    });
                }
            }
        }
        asyncLoadIdNamePairs();
    }

    store.likeList = async function(id, email) {
        async function asyncLikeList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let likesList = playlist.likeList
                if(likesList.includes(email)) {
                    console.log("HAS LIKED BEFORE")
                    likesList.splice(likesList.indexOf(email),1)
                    playlist.likeList = likesList
                    playlist.likes = playlist.likes - 1
                }
                else {
                    console.log("NOT LIKED BEFORE")
                    likesList.push(email)
                    playlist.likeList = likesList
                    playlist.likes = playlist.likes + 1
                }
                console.log(likesList)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        store.chooseLoadPairsKeepCurrent()
                    }
                }
                updateList(playlist);
            }
        }
        asyncLikeList(id);
    }

    store.dislikeList = async function(id, email) {
        async function asyncLikeList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let dislikesList = playlist.dislikeList
                if(dislikesList.includes(email)) {
                    console.log("HAS LIKED BEFORE")
                    dislikesList.splice(dislikesList.indexOf(email),1)
                    playlist.dislikeList = dislikesList
                    playlist.dislikes = playlist.dislikes - 1
                }
                else {
                    console.log("NOT LIKED BEFORE")
                    dislikesList.push(email)
                    playlist.dislikeList = dislikesList
                    playlist.dislikes = playlist.dislikes + 1
                }
                console.log(dislikesList)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        store.chooseLoadPairsKeepCurrent()
                    }
                }
                updateList(playlist);
            }
        }
        asyncLikeList(id);
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.chooseLoadPairs();
            history.push("/");
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }

    store.unmarkListForDeletion = function() {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST,
            payload: {}
        });
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        console.log("CUH")
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    store.isInHome = () => {
        return store.currentView === CurrentView.HOME_SCREEN;
    }
    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        try{
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                tps.clearAllTransactions();
            }
        }
        asyncSetCurrentList(id);
        }catch(error){
            console.log("ERROR HERE")
            console.log(error)
            history.push("/")
        }
        tps.clearAllTransactions();
    }

    store.setPlayingList = function (id) {
        try{
        async function asyncSetPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_PLAYING_LIST,
                        payload: playlist
                    });
                    tps.clearAllTransactions();
                }
            }
        }
        asyncSetPlayingList(id);
        }catch(error){
            console.log("ERROR HERE")
            console.log(error)
            history.push("/")
        }
        tps.clearAllTransactions();
    }

    store.getPlaylist = function(id) {
        async function asyncGetList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                return playlist;
            }
        }
        return asyncGetList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    store.clearTransactions = function() {
        tps.clearAllTransactions();
    }

    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }
    store.modalOpen = function() {
        return (store.currentModal !== CurrentModal.NONE)
    }

    store.viewToNone = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_VIEW,
            payload: store.currentView.NONE
        });
    }

    store.viewToHome = function() {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray.sort(store.comparator(store.getSortTypeAlt(store.currentSort)))
                let allLists = response.data.playlists;
                console.log("CURRENT SORT NOW BEFORE LOAD::")
                console.log(store.currentSort)
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_VIEW,
                    payload: { view: CurrentView.HOME_SCREEN,
                                idNamePairs: pairsArray}
                });
                console.log("CURRENT SORT NOW AFTER LOAD::")
                console.log(store.currentSort)
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
        setSearch("")
    }

    store.viewToUser = function() {
        console.log("TO USER!")
        storeReducer({
            type: GlobalStoreActionType.CHANGE_VIEW,
            payload: { view: CurrentView.USER_LISTS,
                        idNamePairs: []}
        });
        setSearch("")
    }

    store.viewToAll = function() {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_VIEW,
            payload: { view: CurrentView.ALL_LISTS,
                        idNamePairs: []}
        });
        setSearch("")
    }

    store.viewIsNone = function() {
        return store.currentView === CurrentView.NONE;
    }

    store.viewIsHome = function() {
        return store.currentView === CurrentView.HOME_SCREEN;
    }

    store.viewIsUser = function() {
        return store.currentView === CurrentView.USER_LISTS;
    }

    store.viewIsAll = function() {
        return store.currentView === CurrentView.ALL_LISTS;
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };