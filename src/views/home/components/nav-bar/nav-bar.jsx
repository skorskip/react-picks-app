import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { PickLogo } from '../../../../components/pick-logo/pick-logo';
import { selectMessageSource } from '../../../../controller/league/leagueSlice';
import { selectAnnouncements,fetchAnnouncements } from '../../../../controller/announcements/announcementsSlice';
import './nav-bar.css';

export const NavBar = () => {
    const {pathname} = useLocation();
    const history = useHistory();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : "";
    const messageSource = useSelector(selectMessageSource);
    const messagesSelect = useSelector(selectAnnouncements);
    const [messages, setMessages] = useState(messagesSelect.announcements);
    const announcementsStatus = useSelector((state) => state.announcements.status);
    const userState = useSelector((state) => state.user.status);
    const dispatch = useDispatch();
    
    const getIconClass = (link) => {
        return (link === route) ? "primary-color" : "secondary-color";
    }

    const goToChat = () => {
        let url = `https://slack.com/app_redirect?channel=${messageSource.chatChannel}`;
        window.open(url, '_blank');
    }

    const clickNav = (location) => {
        if(location === "/announcements") {
            clickAnnouncements();
        }
        history.push(location)
    }

    const messageNotif = (messages > 0) && (
        <Label color='red' attached="top right" className="notif-icon">
            {messages}
        </Label>
    );

    const clickAnnouncements = () => {
        setMessages(0);
        localStorage.setItem("announcementCheck", new Date().toUTCString())
    }

    useEffect(() => {
        if(userState === 'complete' && announcementsStatus === 'idle') {
            const params = { lastCheckDate: localStorage.getItem("announcementCheck") }
            dispatch(fetchAnnouncements(params));
        }
    }, [announcementsStatus, userState, dispatch]);

    useEffect(() => {
        if(messagesSelect.announcements > 0) {
            setMessages(messagesSelect.announcements);
        }
    }, [messagesSelect]);

    return (
        <div className="base-background nav-container">
            <div className="logo-container-large">
                <div onClick={() => clickNav("/games/game")}>
                    <PickLogo sizeParam='xs'/>
                </div>
            </div>
            <div className="button-group">
                <Button icon basic className="nav-button" onClick={goToChat}>
                    <div className="secondary-color" >
                        <Icon size='large' name='slack'/>
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/standings")}>
                    <div className={getIconClass("standings")}>
                        <Icon size='large' name='list'/>
                    </div>
                </Button>
                <div className="logo-container">
                    <div onClick={() => clickNav("/games/game")}>
                        <PickLogo sizeParam='xs'/>
                    </div>
                </div>
                <Button icon basic className="nav-button" onClick={() => clickNav("/announcements")}>
                    <div className={getIconClass("announcements")}>
                        <Icon size='large' name='bullhorn'/>
                        { messageNotif }
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/profile")}>
                    <div className={getIconClass("profile")}>
                        <Icon size='large' name='address card outline' />
                    </div>
                </Button>
            </div>
        </div>
    );
}