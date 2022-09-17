import Toast from 'react-bootstrap/Toast';
import {useEffect, useState} from "react";
import {ToastContainer} from "react-bootstrap";

function ShowToast(props) {
    const [show, setShow] = useState(props.isToastSHow);
    const [close, setClose] = useState(false);
    useEffect(() => {
        if (close === true) {
            alert(close)
        }
        setShow(props.isToastSHow)
    }, [show, props.isToastSHow,close]);
    const toggleShowA = () => setClose(!show);
    return (
        <ToastContainer className="p-3" position="middle-center"
                        style={{width: "20%", height: "90%", position: "fixed"}}>
            <Toast show={show} onClose={toggleShowA} position="middle-center">
                <Toast.Header>
                    <strong className="me-auto">{props.title}</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>{props.content}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ShowToast;