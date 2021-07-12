import React, {useState} from 'react';
import { SHOW_MESSAGE, Subscriber, publish } from '../../utils/pubSub';
import { Message } from 'semantic-ui-react';
import { status } from '../../configs/status';
import './messagePopup.css';

export const MessagePopup = ({}) => {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    
    const showMessageSub = (data) => {
        if(data !== null) {
            setType(data.type);
            setMessage(data.message);
            setShowMessage(true);

            setTimeout(() => {
                publish(SHOW_MESSAGE, null)
            }, 3000)
        } else {
            setShowMessage(false);
        }
    }

    const messageDisplay = (showMessage) && (
        type === status.ERROR ? (
            <Message negative className="message-content">
                <p>🤕 &nbsp; {message}</p>
            </Message>
        ) : (
            <Message success className="message-content">
                <p>👌 &nbsp; {message}</p>
            </Message>
        ) 
    );

    return (
        <>
            <Subscriber topic={SHOW_MESSAGE}>
                {data => (<>{showMessageSub(data)}</>)}
            </Subscriber>
            <div className="message-container">
                { messageDisplay }
            </div>
        </>
    );
}