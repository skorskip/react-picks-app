import React from 'react';
import { Team, TeamSelect } from '../../../../model/week/team';
import './team-card.css'

type Props = {
    team: Team,
    score: number | null,
    highlight: boolean,
    locked: boolean,
    disabled: boolean,
    fill: boolean | null,
    size: string | null,
    spread: number | null,
    onTeamSelected: (selected: TeamSelect) => void
}


export const TeamCard = ({ 
    team, 
    score, 
    highlight, 
    locked, 
    disabled, 
    fill, 
    size, 
    spread, 
    onTeamSelected } : Props) => {

    const getClass = (context: string) => {
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
                classList += fill ? 'base-color team-info-result ' : team.display_color;
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

    const getSpreadClass = () => {
        if(/windows phone|android/i.test(navigator.userAgent)) {
            return 'game-card-spread-android tiertary-color base-background'
        } else {
            return 'game-card-spread tiertary-color base-background'
        }
    }

    const getGameSpread = (number: number) => {
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
            onTeamSelected(new TeamSelect(team, !highlight))
        }
    }

    const teamWithScore = locked && (
        <div className={ getClass('score') }>
            <div className="large-text-padding">{ score ? score : 0}</div>
            <div className="small-text-middle">{ team.abbreviation }</div>
        </div>
    );

    const teamWithName = !locked && (
        <div 
            className={ getClass('name') }>
            <p className="large-text">{ team.abbreviation }</p>
        </div>
    );

    const spreadIcon = (spread != null && spread !== 0) && (
        <div className={getSpreadClass()}>
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