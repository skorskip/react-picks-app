import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPicksIds, updatePicks, deletePicks, selectPicksMessage } from '../../../../controller/picks/picksSlice';
import { GameLoader } from '../../../../components/game-loader/game-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON, SHOW_MESSAGE } from '../../../../configs/topics';
import { status } from '../../../../configs/status';
import { Icon } from 'semantic-ui-react';
import { selectUser } from '../../../../controller/user/userSlice';
import { RootState } from '../../../../store';
import { PickSelected } from '../../../../model/pickSelected/pickSelected';
import { Pick } from '../../../../model/pick/pick';
import { PickDeleteRequest } from '../../../../model/postRequests/pickDeleteRequest';
import { PickRequest } from '../../../../model/postRequests/pickRequest';
import { clear, publish, PubSub, subscribe } from '../../../../controller/pubSub/pubSubSlice';
import './picks-dashboard.css';
import { SnackMessage } from '../../../../components/message/messagePopup';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state: RootState) => state.picks.status);
    const sub = useSelector(subscribe);
    const user = useSelector(selectUser);
    const picksMessage = useSelector(selectPicksMessage);

    const [updatePicksArray, setUpdatePicks] = useState([] as Pick[]);
    const [deletePicksArray, setDeletePicks] = useState([] as number[]); 
    const [inEditMode, setInEditMode] = useState(false);
    const [submitSent, setSubmitSent] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if(loader === status.ERROR) {
            if(picksMessage != null) {
                alert(picksMessage);
            } else {
                let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
                dispatch(publish(request));
            }
        }

        if(loader === status.COMPLETE && submitSent) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.SUCCESS, status.MESSAGE.PICKS.EDIT_SUCCESS));
            dispatch(publish(request)); 
            setSubmitSent(false);
        }
    },[loader, picksMessage, status]);

    useEffect(() => {

        if(sub.topic === NAV_DONE_BUTTON) {
            if(deletePicksArray.length !== 0 ) {
                let request = new PickDeleteRequest(0, 0, 0, user.user_id, deletePicksArray)
                dispatch(deletePicks(request))
            }
            if(updatePicksArray.length !== 0){
                let request = new PickRequest(0,0,0, user.user_id, updatePicksArray)
                dispatch(updatePicks(request));
            }
            setSubmitSent(true);
            dispatch(clear());
        }
        
        if(sub.topic === NAV_EDIT_BUTTON) {
            setInEditMode(sub.data);
        } else {
            setInEditMode(false);
        }

    }, [dispatch, sub]);

    if(loader === status.LOADING || pickIds === undefined) {
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
        tempDelete.push(pickToDelete.pick_id);
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
            { games }
        </div>
    );
} 