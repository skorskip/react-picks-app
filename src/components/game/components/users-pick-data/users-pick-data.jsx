import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, Label } from 'semantic-ui-react';
import { selectUserPickDataByGame } from '../../../../controller/user-pick-data/userPickDataSlice';
import { publish, SHOW_MODAL } from '../../../../utils/pubSub';
import './users-pick-data.css';

export const UsersPickData = ({ game }) => {

    const picksData = useSelector((state) => selectUserPickDataByGame(state, game.game_id));
    const awayPicks = picksData ? picksData.filter((pick) => pick.team_id === game.away_team_id): [];
    const homePicks = picksData ? picksData.filter((pick) => pick.team_id === game.home_team_id): [];
    const [showPickers, setShowPickers] = useState(false);

    const picksDataClick = () => {
        setShowPickers(true);
    }

    const closePicksData = () => {
        setShowPickers(false);
    }

    const setUserModal = (pick) => {
        publish(SHOW_MODAL, pick);
    }

    const picksDataButton = (!showPickers) && (
        <div className="picks-data-overview accent base-background">
            <div className="pick-data-button-group">
                {/* <div className="pick-data" name="away">
                    <div className="pick-data-icon">
                        <Icon size='large' name="users" />
                    </div>
                    <div class="pick-data-icon">
                        { awayPicks.length }
                    </div>
                </div>
                <div className="pick-data" name="home">
                    <div className="pick-data-icon">
                        <Icon size='large' name="users" />
                    </div>
                    <div className="pick-data-icon">
                        { homePicks.length }
                    </div>
                </div> */}
                <Button as= 'div' labelPosition='right'>
                    <Button basic onClick={picksDataClick}>
                        <Icon className="accent" size='large' name='users' />
                    </Button>
                    <Label as='a' className="accent" basic pointing='left'>
                        { awayPicks.length }
                    </Label>
                </Button>
                <Button as= 'div' labelPosition='right'>
                    <Button basic onClick={picksDataClick}>
                        <Icon className="accent" size='large' name='users' />
                    </Button>
                    <Label className="accent" as='a' basic pointing='left'>
                        { homePicks.length }
                    </Label>
                </Button>
            </div>
        </div>
    );

    const buttonListAway = awayPicks.map((pick) => {
        return (
            <Button className="user-item tiertary-color base-background" onClick={() => setUserModal(pick)}>
                <div className="accent">{ pick.first_name } {pick.last_name.substring(0,1)}.</div>
            </Button>
        );
    });

    const buttonListHome = homePicks.map((pick) => {
        return (
            <Button className="user-item tiertary-color base-background" onClick={() => setUserModal(pick)}>
                <div className="accent">{ pick.first_name } {pick.last_name.substring(0,1)}.</div>
            </Button>
        ); 
    })

    const picksDataList = (showPickers) && (
        <>
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
        </>
    )

    return (
        <div className="picks-data-container">
            { picksDataButton }
            { picksDataList }
        </div>
    );
}