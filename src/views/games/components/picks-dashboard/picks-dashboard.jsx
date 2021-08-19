import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPicksIds, selectPicks, updatePicks, deletePicks } from '../../../../controller/picks/picksSlice';
import './picks-dashboard.css';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON, Subscriber, publish } from '../../../../utils/pubSub';
import { status } from '../../../../configs/status';
import { Icon } from 'semantic-ui-react';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state) => state.picks.status);
    const picks = useSelector(selectPicks);

    const [updatePicksArray, setUpdatePicks] = useState([]);
    const [deletePicksArray, setDeletePicks] = useState([]); 
    const [inEditMode, setInEditMode] = useState(false);

    const dispatch = useDispatch();

    if(loader === status.LOADING || pickIds === undefined) {
        return (
            <GameLoader height="110" count="8"/>
        )
    }

    const teamSelected = (event) => {
        let updatePick = JSON.parse(JSON.stringify(picks.find((pick) => pick.game_id === event.gameId)));
        if(event.highlight) {
            let tempUpdate = updatePicksArray;
            updatePick.team_id = event.teamId;
            tempUpdate.forEach((item, index) => {
                if(item.game_id === updatePick.game_id) {
                    tempUpdate.splice(index, 1);
                }
            });
            tempUpdate.push(updatePick);
            setUpdatePicks(tempUpdate);
        }
    }   

    const editMode = (show) => {
        setInEditMode(show);
        return null;
    }

    const submitDelete = (submit) => {
        if(submit) {
            if(deletePicksArray.length !== 0 ) {
                dispatch(deletePicks({ picks: deletePicksArray.map(pick => pick.pick_id) }))
            }
            if(updatePicksArray.length !== 0){
                dispatch(updatePicks({ picks: updatePicksArray }));
            }
            publish(NAV_DONE_BUTTON, null);
        }
        return null;
    }

    const onDelete = (pickToDelete) => {
        let tempDelete = deletePicksArray;
        let tempUpdate = updatePicksArray;
        tempUpdate.forEach((item, index) => {
            if(item.game_id === pickToDelete.game_id) {
                tempUpdate.splice(index, 1);
            }
        });
        tempDelete.push(pickToDelete);
        setDeletePicks(tempDelete);
        setUpdatePicks(tempUpdate);
    }

    const noPicks = pickIds.length === 0 && (
        <div className="no-picks-set secondary-color">
            <div className="no-picks-set-content">No picks made</div>
            <br></br>
            <div className="secondary-color empty-icon">
                <Icon name='hand point left'/>
            </div>
        </div>
    );

    const games = pickIds.map((pickId, index) => {
        return(
            <PicksDashboardWrapper
                key={"game-wrapper-" + pickId}
                id={pickId} 
                previousId={pickIds[index - 1]}
                index={index}
                onTeamSelected={teamSelected}
                inEditMode={inEditMode}
                onDelete={onDelete}
            />
        )
    });

    return (
        <div className="games-container page">
            { noPicks }
            <Subscriber topic={NAV_EDIT_BUTTON}>
                { data => (<>{editMode(data)}</>)}
            </Subscriber>
            <Subscriber topic={NAV_DONE_BUTTON}>
                { data => (<>{submitDelete(data)}</>) }
            </Subscriber>
            { games }
        </div>
    );
} 