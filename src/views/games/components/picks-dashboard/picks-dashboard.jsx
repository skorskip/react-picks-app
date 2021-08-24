import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPicksIds, selectPicks, updatePicks, deletePicks, selectPicksMessage } from '../../../../controller/picks/picksSlice';
import './picks-dashboard.css';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON, Subscriber, publish } from '../../../../utils/pubSub';
import { status } from '../../../../configs/status';
import { Icon } from 'semantic-ui-react';
import { selectUser } from '../../../../controller/user/userSlice';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state) => state.picks.status);
    const picks = useSelector(selectPicks);
    const user = useSelector(selectUser);
    const picksMessage = useSelector(selectPicksMessage);

    const [updatePicksArray, setUpdatePicks] = useState([]);
    const [deletePicksArray, setDeletePicks] = useState([]); 
    const [inEditMode, setInEditMode] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if(loader === status.ERROR) {
            if(picksMessage != null) {
                alert(picksMessage);
            }
        }
    },[loader, picksMessage, status]);

    if(loader === status.LOADING || pickIds === undefined) {
        return (
            <GameLoader height="110" count="8"/>
        )
    }

    const teamSelected = (event) => {
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

    const onDelete = (pickToDelete) => {
        let tempDelete = deletePicksArray;
        let tempUpdate = updatePicksArray.filter(pick => pick.pick_id !== pickToDelete.pick_id)
        tempDelete.push(pickToDelete.pick_id);
        setDeletePicks(tempDelete);
        setUpdatePicks(tempUpdate);
    }

    const editMode = (show) => {
        setInEditMode(show);
        return null;
    }

    const submitEdit = (submit) => {
        if(submit != null) {
            if(deletePicksArray.length !== 0 ) {
                dispatch(deletePicks({ picks: deletePicksArray, userId: user.user_id }))
            }
            if(updatePicksArray.length !== 0){
                dispatch(updatePicks({ picks: updatePicksArray, userId: user.user_id }));
            }
            publish(NAV_DONE_BUTTON, null);
        }
        return null;
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
                userId={user?.user_id}
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
                { data => (<>{submitEdit(data)}</>) }
            </Subscriber>
            { games }
        </div>
    );
} 