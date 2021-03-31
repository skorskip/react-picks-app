import React from 'react';
import { Icon } from 'semantic-ui-react';
import './pick-status.css';

export const PickStatus = ({ submitTime, pickSuccess }) => {
    const status = () => {
        switch(pickSuccess) {
            case "WIN" : 
                return <Icon circular className="pick-status-icon success" name="check" size="large"/>;
            case "LOSE" : 
                return <Icon circular className="pick-status-icon failure" name="times" size="large"/>;
            case "PUSH" : 
                return <Icon circular className="pick-status-icon secondary" name="exchange" size="large"/>;
            default :
                if(new Date(submitTime) >  new Date()){
                    return <Icon circular className="pick-status-icon tiertary" name="at" size="large"/>;
                } else {
                    return <Icon circular className="pick-status-icon warn" name="lock" size="large"/>;
                }
        }
    }

    return (
        <div className="pick-icon base-background tiertary">
            { status() }
        </div>
    );
}