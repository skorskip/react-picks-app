import React, {useEffect, useState} from 'react';
import { SHOW_MESSAGE } from '../../utils/pubSub';
import { Message, Icon } from 'semantic-ui-react';
import { status } from '../../configs/status';
import './messagePopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { subscribe, publish } from '../../controller/pubSub/pubSubSlice';

export const MessagePopup = () => {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const sub = useSelector(subscribe);
    const dispatch = useDispatch();

    const messageDisplay = (showMessage) && (
        type === status.ERROR ? (
            <Message negative className="message-content base-background">
                <Icon name='times'/><div className="secondary-color">{message}</div>
            </Message>
        ) : (
            <Message success className="message-content base-background">
                <Icon name='thumbs up'/><div className="secondary-color">{message}</div>
            </Message>
        ) 
    );

    useEffect(() => {
        if(sub.topic === SHOW_MESSAGE) {
            if(sub.data != null && sub.data.message !== "" && sub.data.message != null) {
                setType(sub.data.type);
                setMessage(sub.data.message);
                setShowMessage(true);
    
                setTimeout(() => {
                    dispatch(publish("", {}))
                }, 3000)
            } else {
                setShowMessage(false);
            }
        }
    }, [sub, dispatch])

    return (
        <div className="message-container">
            { messageDisplay }
        </div>
    );
}