import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { status } from '../../../../configs/status';
import { SHOW_MESSAGE } from '../../../../configs/topics';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { User } from '../../../../model/user/user';
import { Game } from '../../../../model/week/game';
import { RootState } from '../../../../store';
import { formatDate, showSubmitTime } from '../../../../utils/dateFormatter';
import './game-submit-time.scss';

type Props = {
    game: Game,
    prevGame: Game,
    user: User
}

export const GameSubmitTime = ({game, prevGame}: Props) => {

    const showSubmitTimeBool = showSubmitTime(game, prevGame);
    const remindLoader = useSelector((state: RootState) => state.announcements.reminderStatus);
    const dispatch = useDispatch();

    const submitBy = showSubmitTimeBool && (
        <div className='full-row'>
            <div className="game-card-date">
                <div className="date-text secondary-color">
                    <Icon className="primary-color" name="calendar alternate outline"/>
                    Submit by: { formatDate(new Date(game?.pick_submit_by_date)) }
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        if(remindLoader === status.COMPLETE) {
            let request = new PubSub(SHOW_MESSAGE, 
                new SnackMessage(status.SUCCESS, status.MESSAGE.REMINDERS.SET_SUCCESS));
            dispatch(publish(request)); 
        } else if(remindLoader === status.ERROR) {
            let request = new PubSub(SHOW_MESSAGE, 
                new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }, [remindLoader, dispatch]);

    return(
        <>
            { submitBy }
        </>
    );
}