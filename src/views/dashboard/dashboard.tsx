import { useEffect, useState } from 'react';
import { Schedule } from './components/schedule/schedule';
import './dashboard.scss';
import { HotStreak } from './components/hot-streak/hot-streak';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectLeague } from '../../controller/league/leagueSlice';
import { fetchUserStandings } from '../../controller/user-standings/userStandingsSlice';
import { status } from '../../configs/status';
import { PickMini } from '../../components/pick-mini/pick-mini';
import { fetchWeek, selectGames, selectPicks, selectTeams, getSetWeek, selectIsAllGamesCompleted, selectUserPickData } from '../../controller/week/weekSlice';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { Button, Icon, Label } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { fetchAnnouncements, selectAnnouncements } from '../../controller/announcements/announcementsSlice';
import { getAnnouncementCheckLocal, resetAnnouncementCheckLocal } from '../../utils/localData';
import { DateRequest } from '../../model/postRequests/dateRequest';
import { fetchBonusEligible, selectBonusEligible } from '../../controller/user/userSlice';
import { UserStats } from '../../components/user-stats/user-stats';
import { PickPeekModal } from '../../components/pick-peek-modal/pick-peek-modal';
import { PicksUserData } from '../../model/week/picksUserData';
import { publish, PubSub } from '../../controller/pubSub/pubSubSlice';
import { SHOW_MODAL } from '../../configs/topics';

export const Dashboard = () => {
    const standingsStatus = useSelector((state: RootState) => state.userStandings.status);
    const leagueStatus = useSelector((state: RootState) => state.league.status);
    const league = useSelector(selectLeague);
    const weekState = useSelector((state: RootState) => state.week.status);
    const games = useSelector(selectGames);
    const allGamesCompleted = useSelector(selectIsAllGamesCompleted);
    const teams = useSelector(selectTeams);
    const picks = useSelector(selectPicks);
    const announcementsStatus = useSelector((state:RootState) => state.announcements.status);
    const messagesSelect = useSelector(selectAnnouncements);
    const [messages, setMessages] = useState(messagesSelect.announcements);
    const setWeek = useSelector((state: RootState) => getSetWeek(state));
    const history = useHistory();
    const bonusState = useSelector((state: RootState) => state.user.bonusState);
    const bonusUsers = useSelector(selectBonusEligible);
    const pickData = useSelector(selectUserPickData);
    const weekStatus = useSelector((state: RootState) => state.week.status);
    const dispatch = useDispatch();

    const header = () => {
        const today = new Date();
        return (
            <div className="header">
                <div className="title secondary-color">
                    {
                        (today.getHours() >= 17) ? 
                        'Good Evening!' :
                        today.getHours() >= 12 ? 
                        'Good Afternoon!' :
                        'Good Morning!'
                    }
                </div>
                <span className="secondary-color">It's Week {league.currentWeek} of the {league.currentSeason} {league.currentSeasonType === 3 ? 'Postseason' : 'Season'}</span>
            </div>
        );
    };

    const clickNav = (location: string) => {
        if(location === "/announcements") {
            clickAnnouncements();
        }
        history.push(location)
    }

    const clickAnnouncements = () => {
        setMessages(0);
        resetAnnouncementCheckLocal();
    }

    const setUserModal = (pick: PicksUserData | undefined) => {
        if (pick) dispatch(publish(new PubSub(SHOW_MODAL, pick)));
    }

    const messageNotif = (messages > 0) && (
        <Label color='red' attached="top right" className="notif-icon">
            {messages}
        </Label>
    );

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({
                season: league.currentSeason, 
                seasonType: league.currentSeasonType, 
                week: league.currentWeek
            }));
        }
    }, [dispatch, standingsStatus, leagueStatus, league]);

    useEffect(() => {
        if((weekState === status.IDLE || setWeek !== league.currentWeek) && leagueStatus === status.COMPLETE && weekState !== status.ERROR) {
            let request = new SeasonRequest(league.currentSeason, league.currentSeasonType, league.currentWeek);
            dispatch(fetchWeek(request));
        }
    }, [weekState, leagueStatus, league, dispatch]);

    useEffect(() => {
        if(announcementsStatus === status.IDLE) {
            const params = new DateRequest(getAnnouncementCheckLocal())
            dispatch(fetchAnnouncements(params));
        }
    }, [announcementsStatus, dispatch]);

    useEffect(() => {
        if(messagesSelect.announcements > 0) {
            setMessages(messagesSelect.announcements);
        }
    }, [messagesSelect]);

    useEffect(() => {
        if (bonusState === status.IDLE && leagueStatus === status.COMPLETE) {
            let request = new SeasonRequest(league.currentSeason, league.currentSeasonType, league.currentWeek);
            dispatch(fetchBonusEligible(request));
        }
    },[bonusState, bonusUsers, league, leagueStatus]);

    useEffect(() => {
        if(standingsStatus === status.IDLE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [dispatch, standingsStatus, league]);

    return (
        <>
            <div className='dashboard-header'>
                {header()}
                <Button icon basic className="nav-button" onClick={() => clickNav("/announcements")}>
                    <div className="secondary-color">
                        <Icon size='large' name='bullhorn' className="nav-icon"/>
                        { messageNotif }
                    </div>
                </Button>
            </div>
            <div className="dashboard-content">
                <div className="user-stats">
                    <UserStats></UserStats>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="sub-title secondary-color">Weekly Bonus <div className="success-color count">${league.bonus.currentPotAmt.toFixed(2)}</div></div>
                {
                    (bonusUsers.length && !allGamesCompleted) 
                    ? (<span className="secondary-color">Players currently in the running...</span>) 
                    : (bonusUsers.length && allGamesCompleted)
                    ? (<span className="secondary-color">Bonus winner(s)</span>) 
                    : (<></>)
                }
                {
                    (!allGamesCompleted && bonusUsers.length === 0) 
                    ? <></> 
                    : (
                        <HotStreak 
                            users={bonusUsers} 
                            allGamesCompleted={allGamesCompleted}
                            userPicksData={pickData}
                            isLoading={weekStatus === status.LOADING}
                            showPickModal={(pick) => setUserModal(pick)}
                        />
                    )
                }
            </div>
            <div className="dashboard-content">
                <div className="sub-title secondary-color">Picks</div>
                <PickMini 
                    games={games} 
                    picks={picks} 
                    teams={teams} 
                    isLoading={weekState === status.LOADING}/>
            </div>
            <Schedule games={games} picks={picks} teams={teams}></Schedule>
            <PickPeekModal />
        </>
    );
}