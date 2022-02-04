import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from 'react-router-dom';
import { fetchPicksForUser, selectPicksForUser } from "../../../../controller/picks-for-user/picksForUserSlice";
import { userStandingById, fetchUserStandings } from "../../../../controller/user-standings/userStandingsSlice";
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { status } from '../../../../configs/status';
import "./others-dashboard.css";
import { Icon } from "semantic-ui-react";
import { RootState } from "../../../../store";
import { PickRequest } from "../../../../model/postRequests/pickRequest";
import { publish, PubSub } from "../../../../controller/pubSub/pubSubSlice";
import { SHOW_MESSAGE } from "../../../../configs/topics";
import { SnackMessage } from "../../../../components/message/messagePopup";
import { toInt } from "../../../../utils/tools";
import { GameCard } from "../../../../components/game-card/game-card";
import { GameLoader } from "../../../../components/game-loader/game-loader";
import { ProfileImage } from "../../../../components/profile-image/profile-image";
import { selectGames, selectTeams } from "../../../../controller/week/weekSlice";

export const OthersDashboard = () => {

    let { search } = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(search);
    const season = toInt(query.get("season"));
    const week = toInt(query.get("week"));
    const seasonType = toInt(query.get("seasonType"));
    const user = toInt(query.get("user"));

    const userInfo = useSelector((state: RootState) => userStandingById(state, user));
    const standingsStatus = useSelector((state: RootState) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueStatus = useSelector((state:RootState) => state.league.status);
    const teams = useSelector(selectTeams);
    const userPicks = useSelector(selectPicksForUser);
    const userPicksStatus = useSelector((state: RootState) => state.picksForUser.status);
    const allGames = useSelector(selectGames);
    const games = allGames.filter(game => userPicks.map(userPick => userPick.game.game_id).includes(game.game_id));
    const dispatch = useDispatch();


    const goBack = () => {
        history.goBack();
    }

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        } else if(standingsStatus === status.ERROR || userPicksStatus === status.ERROR) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }, [dispatch, standingsStatus, leagueStatus, league, userPicksStatus]);


    useEffect(() => {
        if(user != null && week != null && season != null && seasonType != null) {
            let request = new PickRequest(season, seasonType, week, user, [])
            dispatch(fetchPicksForUser(request));
        }
    }, [user, week, season, seasonType, dispatch]);

    if(userPicksStatus === status.LOADING) {
        return (
            <GameLoader height={110} count={8}/>
        )
    }

    const userHeaderInfo = (userInfo) && (
        <div className="other-user-info-container" onClick={goBack}>
            <div className="other-user-info tiertary-light-background">
                <Icon name="chevron left" className="secondary-color"/>
                <div className="secondary-color other-user-name">
                    <ProfileImage size="s" content={userInfo.user_inits} image={userInfo.slack_user_image} showImage={true}/>
                    &nbsp;{userInfo.first_name}&nbsp;{userInfo.last_name}
                </div>
            </div>
        </div>
    )

    const noPicks = (!userPicks.length) && (
        <div className="no-games-set secondary-color">
            No Picks for this user.
        </div>
    );

    const gameCards = (games.length) && (user != null) && games.map((game, i) => {
        let userPick = userPicks.find(pick => pick.game.game_id === game.game_id);

        return (
            <div className="game-card">
                <GameCard
                    key={i + "-users-picks"}
                    game={game}
                    //@ts-ignore
                    pick={userPick.pick}
                    user={userInfo}
                    disabled={true}
                    editMode={false}
                    remove={false}
                    onTeamSelected={() => null}
                    onDeleteClicked={() => null}
                    showSubmitTime={false}
                    //@ts-ignore
                    homeTeam={teams.find(team => team.team_id === game.home_team_id)}
                    //@ts-ignore
                    awayTeam={teams.find(team => team.team_id === game.away_team_id)}
                />
            </div>
        )
    });

    return (
        <div className="games-container">
            { userHeaderInfo }
            { noPicks }
            { gameCards }
        </div>
    );
}