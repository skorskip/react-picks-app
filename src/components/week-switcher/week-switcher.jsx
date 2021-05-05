import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { selectLeague } from '../../controller/league/leagueSlice';
import { WEEK_SHOW_WEEKS, publish } from '../../utils/pubSub';
import './week-switcher.css';

export const WeekSwitcher = () => {

    const history = useHistory();
    let { view } = useParams();
    let { search } = useLocation();
    const league = useSelector(selectLeague);
    const query = new URLSearchParams(search);
    const currentWeek = league.currentWeek;
    const season = query.get("season") === null ? league.currentSeason : parseInt(query.get("season"));
    const week = query.get("week") === null ? league.currentWeek : parseInt(query.get("week"));
    const seasonType = query.get("seasonType") === null ? league.currentSeasonType : parseInt(query.get("seasonType"));
    const [weeksShown, setWeeksShown] = useState(false);

    const weekPrev = () => {
        history.push(`/games/${view}?season=${season}&seasonType=${seasonType}&week=${parseInt(week) - 1}`);
    }

    const weekNext = () => {
        history.push(`/games/${view}?season=${season}&seasonType=${seasonType}&week=${parseInt(week) + 1}`);
    }

    const showWeeks = (weekNum) => {
        if(weeksShown) {
            history.push(`/games/${view}?season=${season}&seasonType=${seasonType}&week=${weekNum}`);
            setWeeksShown(false);
            publish(WEEK_SHOW_WEEKS, false);
        } else {
            setWeeksShown(true);
            publish(WEEK_SHOW_WEEKS, true);
        }
    }

    const prevButton = (week !== 1) && (
        <div className="week-header-next base-background tiertary-color" onClick={weekPrev}>
            <div className="week-arrow-next-icon secondary-color">
                <Icon name="chevron left" />
            </div>
        </div>
    );

    const nextButton = (currentWeek !== week) && (
        <div className="week-header-next base-background tiertary-color" onClick={weekNext}>
            <div className="week-arrow-next-icon secondary-color">
                <Icon name="chevron right" />
            </div>
        </div>
    )

    const weekButton = (weekNum) => {
        return (
            <div className="week-header base-background tiertary-color" onClick={() => showWeeks(weekNum)}>
                <div className="week-title secondary-color">
                    Week {weekNum}
                </div>
                <div className="week-arrow-icon secondary-color">
                    {(weeksShown) ? (<Icon name="chevron down"/>) : (<Icon name="chevron up" />)}
                </div>
            </div>);
    };

    const weeksButton = () => {
        var weeksObject = [];
        for(let i = currentWeek; i > 0; i--) { 
            weeksObject.push(weekButton(i));
        }
        return weeksObject;
    }

    if(weeksShown) {
        var object = weeksButton();
        return (
            <div className="weeks-container">
                { object }
            </div>
        );
    }

    return (
        <div className="week-header-container">
            { prevButton }
            { weekButton(week) }
            { nextButton }
        </div>
    )
}