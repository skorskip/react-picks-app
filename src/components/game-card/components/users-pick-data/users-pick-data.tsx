import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { selectUserPickDataByGame } from '../../../../controller/week/weekSlice';
import { Game, GameStatusEnum } from '../../../../model/week/game';
import { PicksUserData } from '../../../../model/week/picksUserData';
import { RootState } from '../../../../store';
import { SHOW_MODAL } from '../../../../configs/topics';
import './users-pick-data.css';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { ProfileImage } from '../../../profile-image/profile-image';

type Props = {
    game: Game
}

export const UsersPickData = ({ game }:Props) => {

    const picksData = useSelector((state: RootState) => selectUserPickDataByGame(state, game.game_id));
    const awayPicks = picksData ? picksData.filter((pick) => pick.team_id === game.away_team_id): [];
    const homePicks = picksData ? picksData.filter((pick) => pick.team_id === game.home_team_id): [];
    const [showPickers, setShowPickers] = useState(false);
    const dispatch = useDispatch();

    const picksDataClick = () => {
        setShowPickers(!showPickers);
    }

    const closePicksData = () => {
        setShowPickers(false);
    }

    const setUserModal = (pick: PicksUserData) => {
        dispatch(publish(new PubSub(SHOW_MODAL, pick)));
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

    const getIconColor = (teamType: string) => {
        if(game.game_status === GameStatusEnum.completed) {
            if(game.winning_team_id === null) {
                return "accent";
            } else if(teamType === 'away' && game.winning_team_id === game.away_team_id) {
                return "base-color"
            } else if(teamType === 'home' && game.winning_team_id === game.home_team_id) {
                return "base-color"
            } else {
                return "accent";
            }
        } else {
            return "accent";
        } 
    }

    const picksChits = (pickList: PicksUserData[], colorType: string) => {
        return (
            <div className={getIconColor(colorType)  + " user-pick-font"}>
                {
                    (pickList.length === 0) && (
                        <ProfileImage size="xs" content={pickList.length} image="" showImage={false}/>
                    )
                }
                {
                    (pickList.length > 0) && (
                        <ProfileImage size="xs" content={pickList[0].user_inits} image={pickList[0].slack_user_image} showImage={true}/>
                    )
                }                
                {
                    (pickList.length > 1) && (
                        <div className="user-data-images">
                            <ProfileImage size="xs" content={pickList[1].user_inits} image={pickList[1].slack_user_image} showImage={true}/>
                        </div>
                    )
                }
                {
                    (pickList.length === 3) && (
                        <div className="user-data-images">
                            <ProfileImage size="xs" content={pickList[2].user_inits} image={pickList[2].slack_user_image} showImage={true}/>
                        </div>
                    )
                }
                {
                    (pickList.length > 3) && (
                        <div className="user-data-images">
                            <ProfileImage size="xs" content={pickList.length} image="" showImage={false}/>
                        </div>
                    )
                }
            </div>
        )
    }

    const picksDataButton = (pickList: PicksUserData[], colorType: string) => {
        return (
            <div className="floating-users-pick-button" onClick={picksDataClick}>
                <div className="user-pick-label-container">
                    <div className="tiertary-color user-pick-label">
                        { picksChits(pickList, colorType) }
                    </div>
                </div>
            </div>
        )
    }

    const picksDataButtonGroup = (
        <div className={containerClass()}>
            <div className={groupClass()}>
                {picksDataButton(awayPicks, 'away')}
                {picksDataButton(homePicks, 'home')}
            </div>
        </div>
    );

    const buttonList = (picksList: PicksUserData[]) => picksList.map((pick) => {
        return (
            <Button 
                key={pick.pick_id + "-pick-data"} 
                className="user-item secondary-color tiertary-light-background" 
                onClick={() => setUserModal(pick)}>

                <div className="users-pick-button-content">
                    <ProfileImage size="xs" content={pick.user_inits} image={pick.slack_user_image} showImage={true}/>
                    &nbsp;{ pick.first_name } {pick.last_name.substring(0,1)}.
                </div>
            </Button>
        ); 
    })

    const picksDataList = (showPickers) && (
        <div className="users-pick-list">
            <div className="picks-data-users">
                <div className="users-column">
                    { buttonList(awayPicks) }
                </div>
                <div className="users-column">
                    { buttonList(homePicks) }
                </div>
            </div>
            <Button onClick={closePicksData} className="show-less-button secondary-color base-background">
                <div className="show-less-button-group">
                    <Icon name="chevron up" />
                    Show Less
                </div>
            </Button>
        </div>
    )

    return (
        <>
            { picksDataList }
            { picksDataButtonGroup }
        </>
    );
}