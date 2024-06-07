import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectPicks, 
    updatePicks, 
    deletePicks, 
    selectGamesPicks, 
    selectTeams, 
    selectUserPickData,
    selectGamesNotComplete,
    deleteWeek
} from '../../../../controller/week/weekSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON } from '../../../../configs/topics';
import { status } from '../../../../configs/status';
import { Icon } from 'semantic-ui-react';
import { selectUser } from '../../../../controller/user/userSlice';
import { RootState } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { Pick } from '../../../../model/week/pick';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { clear, subscribe } from '../../../../controller/pubSub/pubSubSlice';
import { GameCard } from '../../../../components/game-card/game-card';
import { UsersPickData } from '../../../../components/users-pick-data/users-pick-data';
import { GameSubmitTime } from '../../components/game-submit-time/game-submit-time';
import './picks-dashboard.css';
import { PickButton } from '../../../../common/PickButton/PickButton';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { useLocation } from 'react-router-dom';
import { toInt } from '../../../../utils/tools';

export const PicksDashboard = () => {

    const games = useSelector(selectGamesPicks);
    const picks = useSelector(selectPicks);
    const teams = useSelector(selectTeams);
    const loader = useSelector((state: RootState) => state.week.status);
    const sub = useSelector(subscribe);
    const user = useSelector(selectUser);
    const pickData = useSelector(selectUserPickData);
    const incompleteGames = useSelector(selectGamesNotComplete);
    const league = useSelector(selectLeague);
    const pickStatus = useSelector((state: RootState) => state.week.picksStatus);

    const [updatePicksArray, setUpdatePicks] = useState([] as Pick[]);
    const [deletePicksArray, setDeletePicks] = useState([] as Pick[]); 
    const [inEditMode, setInEditMode] = useState(false);

    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const week = toInt(query.get("week"));

    const dispatch = useDispatch();

    useEffect(() => {
        if(sub.topic === NAV_DONE_BUTTON) {
            if(deletePicksArray.length !== 0 ) {
                let request = new PickRequest(0, 0, 0, user.user_id, deletePicksArray)
                dispatch(deletePicks(request));
                dispatch(clear());
            }
            if(updatePicksArray.length !== 0){
                let request = new PickRequest(0,0,0, user.user_id, updatePicksArray)
                dispatch(updatePicks(request));
                dispatch(clear());
            }
        }
        
        if(sub.topic === NAV_EDIT_BUTTON) {
            setInEditMode(sub.data);
        } else {
            setInEditMode(false);
        }

    }, [dispatch, sub, updatePicksArray, deletePicksArray, user.user_id]);

    if(loader === status.LOADING || pickStatus === status.LOADING) {
        return (
            <GameLoader height={110} count={8}/>
        )
    }

    const teamSelected = (event: PickSelected) => {
        let updatePick = event.pick;
        
        if(event.highlight) {
            let tempUpdate = updatePicksArray;
            if(updatePicksArray.find(pick => pick.pick_id === updatePick.pick_id)) {
                tempUpdate = updatePicksArray.filter(pick => pick.pick_id !== updatePick.pick_id);
            } else {
                tempUpdate.push(updatePick);
            }
            setUpdatePicks(tempUpdate);
        }
    }

    const onDelete = (pickToDelete: Pick) => {
        let tempDelete = deletePicksArray;
        let tempUpdate = updatePicksArray.filter(pick => pick.pick_id !== pickToDelete.pick_id)
        tempDelete.push(pickToDelete);
        setDeletePicks(tempDelete);
        setUpdatePicks(tempUpdate);
    }

    const getGameContainerClass = (isRemoved: boolean) => {
        return (isRemoved) ? "remove" : "game-card base-background tiertary-color"
    }

    const deleteWeekDialog = () => {
        let dialogConfirm = window.confirm("Are you sure you want to drop this week's picks? (This is your only mulligan and cannot be undone)");
        if(dialogConfirm) {
            dispatch(deleteWeek(
                new PickRequest(
                    league.currentSeason, 
                    league.currentSeasonType, 
                    league.currentWeek, 
                    user.user_id, 
                    [])
                )
            )
        } 
    }

    const deleteWeekButton = (
        games.length !== 0 &&
        (week === league.currentWeek || week == null) &&
        incompleteGames.length === 0 && 
        !user.current_season_data.dropped_week &&
        league.maxSeasonWeek !== league.currentWeek &&
        league.currentSeason !== 3) && (
        <div className='delete-week-container'>
            <PickButton
                type="failure"
                content="Drop This Week's Picks"
                styling="delete-week-button"
                clickEvent={() => deleteWeekDialog()}
            ></PickButton>
        </div>
    )

    const noPicks = (!games.length) && (
        <div className="no-picks-set secondary-color">
            <div className="no-picks-set-content">No picks made</div>
            <br></br>
            <div className="secondary-color empty-icon">
                <Icon name='hand point left'/>
            </div>
        </div>
    );

    const gameCards = (games.length > 0) && games.map((game, i) => {
        let pick = picks.find(pick => pick.game_id === game.game_id);
        //@ts-ignore
        let remove = deletePicksArray.map(d => d.pick_id).includes(pick.pick_id);

        return(
            <>
                <GameSubmitTime 
                    //@ts-ignore
                    key={"time-" + pick.pick_id}
                    game={game} 
                    prevGame={games[i - 1]} 
                    user={user}
                />
                <div 
                    key={"game-card-" + game.game_id}
                    className={ getGameContainerClass(remove) }
                >
                    <GameCard
                        //@ts-ignore
                        key={"game-" + pick.pick_id}
                        game={game}
                        pick={picks.find(pick => pick.game_id === game.game_id)}
                        user={user}
                        disabled={(!inEditMode)}
                        editMode={inEditMode}
                        remove={remove}
                        //@ts-ignore
                        homeTeam={teams.find(team => team.team_id === game.home_team_id)}
                        //@ts-ignore
                        awayTeam={teams.find(team => team.team_id === game.away_team_id)}
                        onTeamSelected={(event:PickSelected) => teamSelected(event)}
                        //@ts-ignore
                        onDeleteClicked={() => onDelete(pick)}
                    />
                    <UsersPickData 
                        //@ts-ignore
                        key={"pick-data-" + pick.pick_id}
                        game={game}
                        picksData={pickData.filter(data => data.game_id === game.game_id)}
                    />
                </div>
            </>
        )
    });

    return (
        <div className="games-container page">
            { deleteWeekButton }
            { noPicks }
            { gameCards }
        </div>
    );
} 