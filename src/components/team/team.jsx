import React from 'react';
import './team.css'

export const Team = ({ team, score, highlight, locked, disabled, fill, size, spread, onTeamSelected }) => {

    const getClass = (context) => {
        switch(context) {
            case 'name' : {
                let classList = team.display_color;
                classList += highlight ? ' highlight-team ' : '';
                classList += size === 'medium' ? ' team-info-medium ' : ' team-info ';
                return classList;
            };
            case 'score' : {
                let classList = 'team-info disabled ';
                classList += highlight ? 'highlight-team ' : '';
                classList += fill ? 'base team-info-result ' : team.display_color;
                return classList;
            };
            case 'card' : {
                let classList = ""
                classList += size === 'medium' ? 'team-card-medium ' : 'team-card ';
                classList += fill ? team.display_color + '-background' : 'quaternary-background';
                return classList;
            };
            default : {
                return ""
            }
        }
    }

    const getGameSpread = (number) => {
        if(number){
            if(number > 0) {
                return '+' + number;
            } else {
                return number;
            }
        } 
    }

    const teamSelected = () => {
        if(!locked && !disabled){
            onTeamSelected({team: team, highlight: !highlight})
        }
    }

    const teamWithScore = locked && (
        <div className={ getClass('score') }>
            <div className="large-text-padding">{ score }</div>
            <div className="small-text-middle">{ team.abbreviation }</div>
        </div>
    );

    const teamWithName = !locked && (
        <div 
            className={ getClass('name') }>
            <p className="large-text">{ team.abbreviation }</p>
        </div>
    );

    const spreadIcon = (spread != null) && (
        <div className="game-card-spread tiertary base-background">
            <div className="game-card-spread-icon accent base-background">
                <b>
                    { getGameSpread(spread) }
                </b>
            </div>
        </div>
    )

    return (
        <>
            <div className={ getClass('card') } onClick={teamSelected}>
                { teamWithScore }
                { teamWithName }
                { spreadIcon }
            </div>
        </>
    ); 

}