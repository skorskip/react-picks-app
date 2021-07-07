import React from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { selectAnnouncements } from '../../controller/announcements/announcementsSlice';
import './announcements.css';
import { useSelector } from 'react-redux';
import { Placeholder } from 'semantic-ui-react';
import { status } from '../../configs/status';

export const Announcements = () => {
    const messagesSelect = useSelector(selectAnnouncements);
    const messages = messagesSelect.messages;
    const announcementsStatus = useSelector((state) => state.announcements.status);
    
    if(announcementsStatus === status.LOADING || announcementsStatus === status.IDLE) {
        return (
            <>
                <Placeholder style={{ height: 200, borderRadius: "1em", margin: 10}}>
                    <Placeholder.Image />
                </Placeholder>
                <Placeholder style={{ height: 200, borderRadius: "1em", margin: 10}}>
                    <Placeholder.Image />
                </Placeholder>
                <Placeholder style={{ height: 200, borderRadius: "1em", margin: 10}}>
                    <Placeholder.Image />
                </Placeholder>
            </>
        );
    }

    if(messages.length === 0) {
        return (
            <div className="no-messages-set secondary-color">
                😴&nbsp;No recent announcements
            </div>
        )
    }

    const messagesList = messages.map((message) => {
        return (
            <div className="card base-background tiertary-color">
                <div className="date-title tiertary-color">
                    <span className="date-text primary-color">
                        { formatDate(new Date(message.date)) }
                    </span>
                </div>
                <div className="content secondary-color">{ message.message }</div>
            </div>
        );
    });

    return (
        <div className="content">
            <div className="message-container">
                { messagesList }
            </div>
        </div>
    );
}