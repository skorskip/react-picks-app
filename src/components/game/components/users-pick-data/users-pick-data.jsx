import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, Label } from 'semantic-ui-react';
import { selectUserPickDataByGame } from '../../../../controller/user-pick-data/userPickDataSlice';
import { GameStatusEnum } from '../../../../model/game/game';
import { publish, SHOW_MODAL } from '../../../../utils/pubSub';
import './users-pick-data.css';

export const UsersPickData = ({ game }) => {

    const picksData = useSelector((state) => selectUserPickDataByGame(state, game.game_id));
    const awayPicks = picksData ? picksData.filter((pick) => pick.team_id === game.away_team_id): [];
    const homePicks = picksData ? picksData.filter((pick) => pick.team_id === game.home_team_id): [];
    const [showPickers, setShowPickers] = useState(false);

    const picksDataClick = () => {
        setShowPickers(!showPickers);
    }

    const closePicksData = () => {
        setShowPickers(false);
    }

    const setUserModal = (pick) => {
        publish(SHOW_MODAL, pick);
    }

    const containerClass = () => {
        if(game.game_status === GameStatusEnum.completed) {
            return "picks-data-container-final";
        } else {
            return "picks-data-container";
        }
    }

    const groupClass = () => {
        if(game.game_status === GameStatusEnum.completed) {
            return "picks-data-group-final";
        } else {
            return "picks-data-group";
        }
    }

    const picksDataButton = (
        <div className={containerClass()}>
            <div className={groupClass()}>
                <div className="floating-users-pick-button" onClick={picksDataClick}>
                    <div className="user-pick-label-container">
                        <Label className="base-background tiertary-color user-pick-label">
                            <Icon name='thumbs up' className="accent"/>
                            <div className="accent">{awayPicks.length}</div>
                        </Label>
                    </div>
                </div>
                <div className="floating-users-pick-button" onClick={picksDataClick}>
                    <div className="user-pick-label-container">
                        <Label className="base-background tiertary-color user-pick-label">
                            <Icon name='thumbs up' className="accent"/>
                            <div className="accent">{homePicks.length}</div>
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );

    const buttonListAway = awayPicks.map((pick) => {
        return (
            <Button className="user-item secondary-color tiertary-light-background" onClick={() => setUserModal(pick)}>
                <div>{ pick.first_name } {pick.last_name.substring(0,1)}.</div>
            </Button>
        );
    });

    const buttonListHome = homePicks.map((pick) => {
        return (
            <Button className="user-item secondary-color tiertary-light-background" onClick={() => setUserModal(pick)}>
                <div>{ pick.first_name } {pick.last_name.substring(0,1)}.</div>
            </Button>
        ); 
    })

    const picksDataList = (showPickers) && (
        <div className="users-pick-list">
            <div className="picks-data-users">
                <div className="users-column">
                    { buttonListAway }
                </div>
                <div className="users-column">
                    { buttonListHome }
                </div>
            </div>
            <Button onClick={closePicksData} className="show-less-button secondary-color base-background">
                <div className="show-less-button-group">
                    <div className="close-modal-icon">
                        <Icon name="chevron up" />
                    </div>
                    Show Less
                </div>
            </Button>
        </div>
    )

    return (
        <>
            { picksDataList }
            { picksDataButton }
        </>
    );
}