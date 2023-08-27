import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { PickButton } from '../../../../common/PickButton/PickButton';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { status } from '../../../../configs/status';
import { SHOW_MESSAGE } from '../../../../configs/topics';
import { fetchSetReminder } from '../../../../controller/announcements/announcementsSlice';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { ReminderRequest } from '../../../../model/postRequests/reminderRequest';
import { User } from '../../../../model/user/user';
import { Game } from '../../../../model/week/game';
import { RootState } from '../../../../store';
import { formatDate, showSubmitTime } from '../../../../utils/dateFormatter';
import './game-submit-time.scss';
import { useHistory } from 'react-router-dom';

type Props = {
    game: Game,
    prevGame: Game,
    user: User
}

export const GameSubmitTime = ({game, prevGame, user}: Props) => {

    const showSubmitTimeBool = showSubmitTime(game, prevGame);
    const remindLoader = useSelector((state: RootState) => state.announcements.reminderStatus);
    const dispatch = useDispatch();
    const history = useHistory();


    const setReminder = async () => {
        if (user.slack_user_id) {
            let dialogConfirm = window.confirm("Set slack reminder?");

            if(dialogConfirm) {
                let request = new ReminderRequest(game.pick_submit_by_date, user.slack_user_id);
                dispatch(fetchSetReminder(request));
            }

        } else {
            let dialogConfirm = window.confirm("Set slack reminder?/n/nTo do so go to the profile page in the Slack section and connect your slack email.");

            if(dialogConfirm) {
                history.push('/profile');
            }
        }

    }

    const submitBy = showSubmitTimeBool && (
        <div className='full-row'>
            <div className="game-card-date">
                <PickButton 
                    styling={(remindLoader === status.LOADING) ? 'date-text-loading' : 'date-text'}
                    clickEvent={setReminder}
                    type='secondary'
                    loading={remindLoader === status.LOADING}
                    content={
                        (remindLoader === status.LOADING) ? (undefined
                        ) : (<>
                            <Icon className="primary-color" name="calendar alternate outline"/>
                            Submit by: { formatDate(new Date(game?.pick_submit_by_date)) }
                        </>)
                    }
                />
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