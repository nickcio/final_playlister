import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FCFCA2',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIAccountErrorModal() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [ errorMsg, setErrorMsg ] = useState(auth.errorMsg);
    console.log("HELLO!!!")
    console.log(auth.errorMsg)
    function handleOk() {
        auth.hideModal();
    }

    return (
        <Modal
            open={auth.errorMessage !== null}
        >
            <Alert sx={style} severity="warning">
            <div
            id="account-error-modal"
            className="is-visible"
            data-animation="slideInOutLeft">
                <div>
                <header>
                        <AlertTitle>Warning</AlertTitle>
                        {errorMsg}
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleOk}
                    >Ok</button>
                </div>
            </div>
            </div>
            </Alert>
        </Modal>
    );
}