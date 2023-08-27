import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../controller/user/userSlice';
import { selectGamesNoPicks, addPicks, selectTeams, selectUserPickData } from '../../../../controller/week/weekSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { Icon } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { status } from '../../../../configs/status';
import { setStagedPicksLocal, resetStagedPicksLocal, getStagedPicksLocal } from '../../../../utils/localData';
import { RootState, useAppThunkDispatch } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { Pick } from '../../../../model/week/pick';
import { GameCard } from '../../../../components/game-card/game-card';
import { toInt } from '../../../../utils/tools';
import { UserTypeEnum } from '../../../../model/user/user';
import { UsersPickData } from '../../../../components/users-pick-data/users-pick-data';
import { GameSubmitTime } from '../../components/game-submit-time/game-submit-time';
import './game-dashboard.css';
import { PickButton } from '../../../../common/PickButton/PickButton';

export const GameDashboard = () => {
    const dispatch = useAppThunkDispatch();
    const user = useSelector(selectUser);
    const games = useSelector(selectGamesNoPicks);
    const teams = useSelector(selectTeams);
    const pickData = useSelector(selectUserPickData);
    const gameLoader = useSelector((state: RootState) => state.week.status);
    const pickStatus = useSelector((state: RootState) => state.week.picksStatus);
    const league = useSelector(selectLeague);
    
    const history = useHistory();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const week = toInt(query.get("week"));

    const [stagedPicks, setStagedPicks] = useState(getStagedPicksLocal() != null ? getStagedPicksLocal() : [] as Pick[]);

    const teamSelected = (event: PickSelected) => {
        let updated = setStagedPicksLocal(stagedPicks, event);
        setStagedPicks(updated);
    }

    const submitPicks = () => {
        let request = new PickRequest(0,0,0,user.user_id,stagedPicks)
        dispatch(addPicks(request));
    }
    
    const getSubmitClass = () => {
        return (stagedPicks.length > 0 && 
            (week === league.currentWeek || week == null)) ? 
            "submit-container show-submit-button" : "submit-container hide-submit-button"
    };

    const noGames = games.length === 0 && (
        <div className="no-games-set secondary-color">
            No Unpicked Games
        </div>
    );

    const gameCards = games.length && games.map((game, i) => {
        return(
            <>
                <GameSubmitTime 
                    game={game} 
                    prevGame={games[i - 1]} 
                    user={user}
                />
                <div 
                    key={"game-container-" + game.game_id}
                    className="game-card"
                >
                    <GameCard
                        key={"game-" + game.game_id}
                        game={game}
                        pick={stagedPicks.find(pick => pick.game_id === game.game_id)}
                        user={user}
                        disabled={user.type !== UserTypeEnum.PARTICIPANT}
                        editMode={false}
                        remove={false}
                        //@ts-ignore
                        homeTeam={teams.find(team => team.team_id === game.home_team_id)}
                        //@ts-ignore
                        awayTeam={teams.find(team => team.team_id === game.away_team_id)}
                        onDeleteClicked={() => null}
                        onTeamSelected={(event: PickSelected) => teamSelected(event)}
                    />
                    <UsersPickData 
                        game={game}
                        picksData={pickData?.filter(data => data.game_id === game.game_id)}
                    />
                </div>
            </>
        )
    });

    useEffect(() => {
        if(pickStatus === status.COMPLETE) {
            setStagedPicks([]);
            resetStagedPicksLocal();
            history.push("/games/pick");
        }
    },[pickStatus, dispatch, history]);

    if(gameLoader === status.LOADING) {
        return (<GameLoader height={110} count={8}/>)
    }
    
    return (
        <>
            <div className="games-container page">
                { noGames }
                { gameCards }
            </div>
            <div className={getSubmitClass()}>
                <PickButton 
                    type="primary"
                    styling="submit-button" 
                    clickEvent={submitPicks}
                    content={
                        <>
                            <Icon name='send'/> Submit ({stagedPicks.length})
                        </>
                    }
                />
            </div>
        </>
    );
} 