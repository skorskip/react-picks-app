import React, {useEffect, useState} from 'react';
import { SHOW_MESSAGE } from '../../configs/topics';
import { Message, Icon } from 'semantic-ui-react';
import { status } from '../../configs/status';
import './messagePopup.css';
import { useDispatch, useSelector } from 'react-redux';
import { subscribe, clear } from '../../controller/pubSub/pubSubSlice';

export class SnackMessage {
    type: string;
    message: string;

    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
    }
}

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
            setType(sub.data.type);
            setMessage(sub.data.message);
            setShowMessage(true);

            setTimeout(() => {
                dispatch(clear)
            }, 3000)
        }
    }, [sub, dispatch]);

    return (
        <div className="message-container">
            { messageDisplay }
        </div>
    );
}