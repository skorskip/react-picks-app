import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPicksIds, selectPicks, updatePicks, deletePicks } from '../../../../controller/picks/picksSlice';
import './picks-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON, Subscriber, publish } from '../../../../utils/pubSub';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state) => state.picks.status);
    const picks = useSelector(selectPicks);

    const [updatePicksArray, setUpdatePicks] = useState([]);
    const [deletePicksArray, setDeletePicks] = useState([]); 
    const [showDelete, setShowDelete] = useState(false);

    const dispatch = useDispatch();

    if(loader === 'loading' || pickIds === undefined) {
        return (
            <PickLoader />
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

    const showDeleteButton = (show) => {
        setShowDelete(show);
        return null;
    }

    const submitDelete = (submit) => {
        if(submit) {
            if(deletePicksArray.length !== 0 ) {
                deletePicksArray.forEach(pick => {
                    dispatch(deletePicks(pick.pick_id));
                });
            }
            if(updatePicksArray.length !== 0){
                updatePicksArray.forEach(pick => {
                    dispatch(updatePicks(pick));
                });
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

    const noPicks = pickIds.size === 0 && (
        <div className="no-games-set secondary-color">
            No Picks made
        </div>
    );

    const games = pickIds.map((pickId, index) => {
        return(
            <PicksDashboardWrapper
                key={pickId}
                id={pickId} 
                previousId={pickIds[index - 1]}
                index={index}
                onTeamSelected={teamSelected}
                showDelete={showDelete}
                onDelete={onDelete}
            />
        )
    });

    return (
        <div className="games-container">
            { noPicks }
            <Subscriber topic={NAV_EDIT_BUTTON}>
                { data => (<>{showDeleteButton(data)}</>)}
            </Subscriber>
            <Subscriber topic={NAV_DONE_BUTTON}>
                { data => (<>{submitDelete(data)}</>) }
            </Subscriber>
            { games }
        </div>
    );
} 