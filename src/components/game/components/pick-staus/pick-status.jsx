import React from 'react';
import { Icon } from 'semantic-ui-react';
import { GameWinStatusEnum } from '../../../../model/game/game';
import './pick-status.css';

export const PickStatus = ({ submitTime, pickSuccess }) => {
    const status = () => {
        switch(pickSuccess) {
            case GameWinStatusEnum.win : 
                return <Icon className="pick-status-icon success-color" name="check" size="big"/>;
            case GameWinStatusEnum.lose : 
                return <Icon className="pick-status-icon failure-color" name="times" size="big"/>;
            case GameWinStatusEnum.push : 
                return <Icon className="pick-status-icon secondary-color" name="exchange" size="big"/>;
            default :
                if(new Date(submitTime) >  new Date()){
                    return <Icon className="pick-status-icon tiertary-color" name="at" size="big"/>;
                } else {
                    return <Icon className="pick-status-icon warn-color" name="lock" size="big"/>;
                }
        }
    }

    return (
        <div className="pick-status base-background">
            <div className="pick-icon base-background tiertary-color">
                { status() }
            </div>
        </div>
    );
}