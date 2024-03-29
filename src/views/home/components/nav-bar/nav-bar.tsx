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
import { getAnnouncementCheckLocal, getLiveThreadCheckLocal, resetAnnouncementCheckLocal, resetLiveThreadCheckLocal } from '../../../../utils/localData';
import { RootState } from '../../../../store';
import { DateRequest } from '../../../../model/postRequests/dateRequest';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { SHOW_MESSAGE } from '../../../../configs/topics';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { endpoints } from '../../../../configs/endpoints';
import { selectUser } from '../../../../controller/user/userSlice';
import { ProfileImage } from '../../../../components/profile-image/profile-image';

export const NavBar = () => {
    const {pathname} = useLocation();
    const history = useHistory();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : "";
    const messageSource = useSelector(selectMessageSource);
    const messagesSelect = useSelector(selectAnnouncements);
    const [messages, setMessages] = useState(messagesSelect.announcements);
    const announcementsStatus = useSelector((state:RootState) => state.announcements.status);
    const user = useSelector(selectUser);
    const userState = useSelector((state:RootState) => state.user.status);
    const leagueState = useSelector((state:RootState) => state.league.status);
    const league = useSelector(selectLeague);
    const [isActiveThread, setIsActiveThread] = useState(false);
    const dispatch = useDispatch();
    
    const getIconClass = (link: string) => {
        return (link === route) ? "primary-color" : "secondary-color";
    }

    const goToChat = () => {
        let url = `https://picks-league.slack.com/channels/${messageSource.channel}`;
        window.open(url, '_blank');
    }

    const clickNav = (location: string) => {
        if(location === "/dashboard") {
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
                
            const params = new DateRequest(getAnnouncementCheckLocal())
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
            let url = endpoints.MESSAGES.ACTIVE_CHAT;
            try {   
                var response = await client.post(url, {lastCheckDate: getLiveThreadCheckLocal()});
                setIsActiveThread(response);
                resetLiveThreadCheckLocal();
            } catch(error) {
                console.error(error);
            }
        }

        if(userState === status.COMPLETE && leagueState === status.COMPLETE ) {
            fetchData();
        }
    }, [userState, leagueState])

    useEffect(() => {
        if(announcementsStatus === status.ERROR){
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }, [announcementsStatus, dispatch]);

    return (
        <div className="base-background nav-container">
            <div className="logo-container-large">
                <div onClick={() => clickNav(`/games/game?season=${league.currentSeason}&seasonType=${league.currentSeasonType}&week=${league.currentWeek}`)}>
                    <PickLogo sizeParam='xs'/>
                </div>
            </div>
            <div className="button-group">
                <Button icon basic className="nav-button" onClick={() => clickNav("/dashboard")}>
                    <div className={getIconClass("dashboard")}>
                        <Icon size='large' name='home' className="nav-icon"/>
                        { messageNotif }
                    </div>
                </Button>
                <Button icon basic className="nav-button" onClick={() => clickNav("/standings")}>
                    <div className={getIconClass("standings")}>
                        <Icon size='large' name='list'/>
                    </div>
                </Button>
                <Button icon basic className="nav-button main-circle-container" onClick={() => clickNav(`/games/game?season=${league.currentSeason}&seasonType=${league.currentSeasonType}&week=${league.currentWeek}`)}>
                    <div className="main-circle base-background primary-color">
                        <PickLogo sizeParam='xs'/>
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
                        <ProfileImage size="s" content={user.user_inits} image={user.slack_user_image} showImage={true}/>
                    </div>
                </Button>
            </div>
        </div>
    );
}