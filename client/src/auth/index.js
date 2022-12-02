import React, { useContext, createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'
import { GlobalStoreContext } from '../store';

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

const CurrentModal = {
    NONE : "NONE",
    ACCOUNT_ERROR : "ACCOUNT_ERROR"
}

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    SET_ERROR: "SET_ERROR",
    ERROR_MSG: "ERROR_MSG"
}

function AuthContextProvider(props) {
    const { store } = useContext(GlobalStoreContext);

    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMsg: "",
        currentModal: CurrentModal.NONE
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMsg: null,
                    currentModal: CurrentModal.NONE
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMsg: null,
                    currentModal: CurrentModal.NONE
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMsg: null,
                    currentModal: CurrentModal.NONE
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: false,
                    errorMsg: null,
                    currentModal: CurrentModal.NONE
                })
            }
            case AuthActionType.SET_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMsg: payload,
                    currentModal: CurrentModal.ACCOUNT_ERROR
                })
            }
            case AuthActionType.ERROR_MSG: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMsg: payload.errorMsg,
                    currentModal: CurrentModal.NONE
                })
            }
            default:
                return auth;
        }
    }

    auth.getUser = async function (email) {
        const response = await api.getUser(email);
        if (response.status === 200) {
            return response.data.user;
        }
    }

    auth.getErrorMsg = () => {
        return auth.errorMsg;
    }

    auth.setErrorMsg = (errorMessage) => {
        authReducer({
            type: AuthActionType.ERROR_MSG,
            payload: errorMessage
        }) 
        return 1;
    }

    auth.isAccountErrorModalOpen = () => {
        return auth.currentModal === CurrentModal.ACCOUNT_ERROR;
    }

    auth.showAccountErrorModal = (errorMessage) => {
        authReducer({
            type: AuthActionType.SET_ERROR,
            payload: errorMessage
        }) 
        console.log(errorMessage)
    }

    auth.hideModal = () => {
        authReducer( {
            type: AuthActionType.LOGOUT_USER,
            payload: null
        })
        console.log("LOGGED OUT 2")
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userName, firstName, lastName, email, password, passwordVerify) {
        try{
            const response = await api.registerUser(userName, firstName, lastName, email, password, passwordVerify);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: null
                    }
                })
                history.push("/login/");
            }
        }catch(error){
            let errorMsg = error.response.data.errorMessage;
            const resp = await auth.setErrorMsg(errorMsg);
            if (resp === 1) {
                auth.showAccountErrorModal(errorMsg);
            }
        }
    }

    auth.loginUser = async function(email, password) {
        try{
            const response = await api.loginUser(email, password);
            
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                console.log("TO HOME")
                store.viewToHome();
            }
        }catch(error){
            let errorMsg = error.response.data.errorMessage;
            const resp = await auth.setErrorMsg(errorMsg);
            if (resp === 1) {
                auth.showAccountErrorModal(errorMsg);
            }
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
            store.viewToHome()
        }
        console.log("LOGGED OUT 1")
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user && auth.user !== "guest") {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        else if(auth.user === "guest") {
            initials = "G"
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.continueAsGuest = function() {
        authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: {
                user: "guest"
            }
        })
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };