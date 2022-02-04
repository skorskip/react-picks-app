import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { SnackMessage } from '../../../../components/message/messagePopup';
import { endpoints } from '../../../../configs/endpoints';
import { status } from '../../../../configs/status';
import { SHOW_MESSAGE } from '../../../../configs/topics';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { User } from '../../../../model/user/user';
import { Game, GameStatusEnum } from '../../../../model/week/game';
import { client } from '../../../../utils/client';
import { formatDate, gameTimeStatusQuarters, showSubmitTime } from '../../../../utils/dateFormatter';
import { setRemindLocal } from '../../../../utils/localData';
import './game-submit-time.css';

type Props = {
    game: Game,
    prevGame: Game,
    user: User
}

export const GameSubmitTime = ({game, prevGame, user}: Props) => {

    const [remindLoading, setRemindLoading] = useState(false);
    const gameLocked = new Date(game?.pick_submit_by_date) <= new Date();
    const showSubmitTimeBool = showSubmitTime(game, prevGame);
    const dispatch = useDispatch();

    const callSetReminder = async () => {
        setRemindLoading(true);
        if(setRemindLocal(game.pick_submit_by_date)) {
            try {
                let url = endpoints.MESSAGES.SET_REMINDER;
                let response = await client.post(url, {
                    pick_submit_by_date: game.pick_submit_by_date,
                    slack_user_id: user.slack_user_id
                });
                if(!response?.error) {
                    setRemindLoading(false);
                    return true;
                }
                return false;
            } catch(error) {
                setRemindLoading(false);
                return false;
            }
        } else {
            return true;
        }
    }

    const setReminder = async () => {
        let dialogConfirm = window.confirm("Set slack reminder?");

        if(dialogConfirm) {
            if(await callSetReminder()) {
                let request = new PubSub(SHOW_MESSAGE, 
                    new SnackMessage(status.SUCCESS, status.MESSAGE.REMINDERS.SET_SUCCESS));
                dispatch(publish(request)); 
            } else {
                let request = new PubSub(SHOW_MESSAGE, 
                    new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
                dispatch(publish(request));
            }
        }
    }

    const submitBy = showSubmitTimeBool && (
        <div className='full-row'>
            <div className="game-card-date">
                {
                    remindLoading ? (
                        <Button 
                            className="date-text-loading tiertary-light-background secondary-color" 
                            width="200" 
                            loading 
                        />
                    ) : (
                        <Button className="date-text tiertary-light-background secondary-color" onClick={setReminder}>
                            <Icon className="primary-color" name="calendar alternate outline"/>
                            Submit by: { formatDate(new Date(game?.pick_submit_by_date)) }
                        </Button>
                    )
                }
            </div>
        </div>
    );

    return(
        <>
            { submitBy }
        </>
    );
}