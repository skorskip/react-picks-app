import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, Card } from 'semantic-ui-react'
import { selectTeamsById } from '../../controller/teams/teamsSlice';
import './team.css'

export const Team = ({ id, score, highlight, locked, fill, size }) => {

    const team = useSelector(selectTeamsById(id));

    const getClass = (context) => {
        switch(context) {
            case 'name' : {
                var classList = team.display_color;
                classList += highlight ? ' highlight-team ' : '';
                classList += size === 'medium' ? ' team-info-medium ' : ' team-info ';
                return classList;
            };
            case 'score' : {
                var classList = 'team-info disabled ';
                classList += highlight ? 'highlight-team ' : '';
                classList += fill ? 'base team-info-result ' : team.display_color;
                return classList;
            };
            case 'card' : {
                var classList = ""
                classList += size == 'medium' ? 'team-card-medium ' : 'team-card ';
                classList += fill ? team.display_color + '-background' : 'quaternary-background';
                return classList;
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

    const teamWithScore = locked && (
        <div className={ getClass('score') }>
            <div class="large-text-padding">{ score }</div>
            <div class="small-text-middle">{ team.abbreviation }</div>
        </div>
    );

    const teamWithName = !locked && (
        <div 
            className={ getClass('name') }>
            <p className="large-text">{ team.abbreviation }</p>
        </div>
    );

    const spread = (spread != null) && (
        <div className="game-card-spread tiertary base-background">
            <div class="game-card-spread-icon accent base-background">
                <b>
                    { getGameSpread(spread) }
                </b>
            </div>
        </div>
    )

    return (
        <Card>
            <Button className={ getClass('card') }>
                { teamWithScore }
                { teamWithName }
            </Button>
            { spread }
        </Card>
    ); 

}