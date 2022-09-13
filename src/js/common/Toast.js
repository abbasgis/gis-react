import Toast from 'react-bootstrap/Toast';
import {useState} from "react";
import {ToastContainer} from "react-bootstrap";

function ShowToast(props) {
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!props.isToastSHow);
    return (
        <ToastContainer id="toast_id" className="p-3" position="middle-center"
                        style={{width: "20%", height: "90%", position: "fixed"}}>
            <Toast show={props.isToastSHow} onClose={toggleShowA} position="middle-center">
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