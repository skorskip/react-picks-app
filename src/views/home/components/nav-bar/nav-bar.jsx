import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { PickLogo } from '../../../../components/pick-logo/pick-logo';
import { selectMessageSource,selectLeague } from '../../../../controller/league/leagueSlice';
import { selectAnnouncements,fetchAnnouncements } from '../../../../controller/announcements/announcementsSlice';
import './nav-bar.css';
import { status } from '../../../../configs/status';
import { client } from '../../../../utils/client';
import { environment } from '../../../../configs/environment';
import { getAnnouncementCheckLocal, getLiveThreadCheckLocal, resetAnnouncementCheckLocal, resetLiveThreadCheckLocal } from '../../../../utils/localData';

export const NavBar = () => {
    const {pathname} = useLocation();
    const history = useHistory();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : "";
    const messageSource = useSelector(selectMessageSource);
    const messagesSelect = useSelector(selectAnnouncements);
    const [messages, setMessages] = useState(messagesSelect.announcements);
    const announcementsStatus = useSelector((state) => state.announcements.status);
    const userState = useSelector((state) => state.user.status);
    const leagueState = useSelector((state) => state.league.status);
    const league = useSelector(selectLeague);
    const [isActiveThread, setIsActiveThread] = useState(false);
    const announcementsUrl = environment.messageServiceURL + 'message/active-thread';
    const dispatch = useDispatch();
    
    const getIconClass = (link) => {
        return (link === route) ? "primary-color" : "secondary-color";
    }

    const goToChat = () => {
        let url = `https://picks-league.slack.com/channels/${messageSource.chatChannel}`;
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
        resetAnnouncementCheckLocal();
    }

    const pulseNotify = (isActiveThread) && (
        <div className="circle-notify-container">
            <div className="circle-notify pulse secondary-background"></div>
        </div>
    )

    useEffect(() => {
        if(userState === status.COMPLETE && 
            announcementsStatus === status.IDLE && 
            leagueState === status.COMPLETE ) {
                
            const params = { lastCheckDate: getAnnouncementCheckLocal() }
            dispatch(fetchAnnouncements(params));
        }
    }, [announcementsStatus, userState, dispatch, leagueState]);

    useEffect(() => {
        if(messagesSelect.announcements > 0) {
            setMessages(messagesSelect.announcements);
        }
    }, [messagesSelect]);

    useEffect(() => {
        const fetchData = async () => {
            try {   
                var response = await client.post(announcementsUrl, {lastCheckDate: getLiveThreadCheckLocal()});
                setIsActiveThread(response);
                resetLiveThreadCheckLocal();
            } catch(error) {
                console.error(error);
            }
        }

        if(userState === status.COMPLETE && leagueState === status.COMPLETE ) {
            fetchData();
        }
    }, [userState, leagueState, announcementsUrl])

    return (
        <div className="base-background nav-container">
            <div className="logo-container-large">
                <div onClick={() => clickNav(`/games/game?season=${league.currentSeason}&seasonType=${league.currentSeasonType}&week=${league.currentWeek}`)}>
                    <PickLogo sizeParam='xs'/>
                </div>
            </div>
            <div className="button-group">
                <Button icon basic className="nav-button" onClick={() => clickNav(`/games/game?season=${league.currentSeason}&seasonType=${league.currentSeasonType}&week=${league.currentWeek}`)}>
                    <div className={getIconClass("games")}>
                        <Icon size='large' name='football ball' className="nav-icon"/>
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/standings")}>
                    <div className={getIconClass("standings")}>
                        <Icon size='large' name='list'/>
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/announcements")}>
                    <div className={getIconClass("announcements")}>
                        <Icon size='large' name='bullhorn' className="nav-icon"/>
                        { messageNotif }
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={goToChat}>
                    <div className="secondary-color" >
                        <Icon size='large' name='comments' className="nav-icon"/>
                    </div>
                    { pulseNotify }
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/profile")}>
                    <div className={getIconClass("profile")}>
                        <Icon size='large' name='user' className="nav-icon"/>
                    </div>
                </Button>
            </div>
        </div>
    );
}