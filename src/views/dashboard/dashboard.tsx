import { useEffect, useState } from 'react';
import { Schedule } from './components/schedule/schedule';
import './dashboard.scss';
import { HotStreak } from './components/hot-streak/hot-streak';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectLeague } from '../../controller/league/leagueSlice';
import { fetchUserStandings, userStandingByCurrent } from '../../controller/user-standings/userStandingsSlice';
import { status } from '../../configs/status';
import { PickMini } from '../../components/pick-mini/pick-mini';
import { fetchWeek, selectGames, selectPicks, selectTeams, getSetWeek, selectUserPickData } from '../../controller/week/weekSlice';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { Button, Icon, Label } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { fetchAnnouncements, selectAnnouncements } from '../../controller/announcements/announcementsSlice';
import { getAnnouncementCheckLocal, resetAnnouncementCheckLocal } from '../../utils/localData';
import { DateRequest } from '../../model/postRequests/dateRequest';
import { fetchBonusEligible, selectBonusEligible, selectUser } from '../../controller/user/userSlice';
import { StandingsUserCard } from '../../components/standings-user-card/standings-user-card';
import { UserStats } from '../../components/user-stats/user-stats';

export const Dashboard = () => {
    const standingsStatus = useSelector((state: RootState) => state.userStandings.status);
    const leagueStatus = useSelector((state: RootState) => state.league.status);
    const league = useSelector(selectLeague);
    const weekState = useSelector((state: RootState) => state.week.status);
    const games = useSelector(selectGames);
    const teams = useSelector(selectTeams);
    const picks = useSelector(selectPicks);
    const pickData = useSelector(selectUserPickData);
    const announcementsStatus = useSelector((state:RootState) => state.announcements.status);
    const messagesSelect = useSelector(selectAnnouncements);
    const [messages, setMessages] = useState(messagesSelect.announcements);
    const setWeek = useSelector((state: RootState) => getSetWeek(state));
    const history = useHistory();
    const bonusState = useSelector((state: RootState) => state.user.bonusState);
    const bonusUsers = useSelector(selectBonusEligible);
    const currentUser = useSelector(selectUser);
    const standings = useSelector((state: RootState) => userStandingByCurrent(state, currentUser));
    const dispatch = useDispatch();

    const header = () => {
        const today = new Date();
        return (today.getHours() >= 12) ? (
                <div className="title secondary-color">
                    Good Afternoon.
                </div>
            ) : (
                <div className="title secondary-color">
                    Good Morning!
                </div>
            )
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

    const messageNotif = (messages > 0) && (
        <Label color='red' attached="top right" className="notif-icon">
            {messages}
        </Label>
    );

    const standingCards = (standingsStatus === status.COMPLETE) && standings.map((standing) => {
        return (
            <StandingsUserCard
                key={ standing.user_id + "-standings-card"}
                standing={standing}
                isCurrentUser={standing.user_id === currentUser.user_id}
            />
        )
    });

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
        if((weekState === status.IDLE || setWeek !== league.currentWeek) && leagueStatus === status.COMPLETE) {
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
                <div className="sub-title secondary-color">Streak</div>
                <HotStreak users={bonusUsers} pickData={pickData}/>
            </div>
            <div className="dashboard-content">
                <div className="sub-title secondary-color">Picks</div>
                <PickMini games={games} picks={picks} teams={teams}/>
            </div>
            <div className="dashboard-content">
                <div className="sub-title secondary-color">Standings</div>
                <div className="streak-standings">
                    { standingCards }
                </div>
            </div>
            <Schedule games={games} picks={picks} teams={teams}></Schedule>
        </>
    );
}