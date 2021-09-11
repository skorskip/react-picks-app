import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { WEEK_SHOW_WEEKS, publish } from '../../../../utils/pubSub';
import './week-switcher.css';

interface RouteParams {
    slug: string
}

export const WeekSwitcher = () => {

    const history = useHistory();
    let view = useParams<RouteParams>();
    let { search } = useLocation();
    const league = useSelector(selectLeague);
    const query = new URLSearchParams(search);
    const currentWeek = league.currentWeek;
    const season = parseInt(query.get("season") === null ? league.currentSeason : query.get("season"));
    const week = parseInt(query.get("week") === null ? league.currentWeek : query.get("week"));
    const seasonType = parseInt(query.get("seasonType") === null ? league.currentSeasonType : query.get("seasonType"));
    const user = query.get("user");
    const [weeksShown, setWeeksShown] = useState(false);

    const weekPrev = () => {
        history.push(`/games/${view.slug}?season=${season}&seasonType=${seasonType}&week=${week - 1}&user=${user}`);
    }

    const weekNext = () => {
        history.push(`/games/${view.slug}?season=${season}&seasonType=${seasonType}&week=${week + 1}&user=${user}`);
    }

    const showWeeks = (weekNum: number) => {
        if(weeksShown) {
            history.push(`/games/${view.slug}?season=${season}&seasonType=${seasonType}&week=${weekNum}&user=${user}`);
            setWeeksShown(false);
            publish(WEEK_SHOW_WEEKS, false);
        } else {
            setWeeksShown(true);
            publish(WEEK_SHOW_WEEKS, true);
        }
    }

    const prevButton = (week !== 1) && (
        <div className="week-header-next tiertary-light-background" onClick={weekPrev}>
            <div className="week-arrow-next-icon secondary-color">
                <Icon name="chevron left" />
            </div>
        </div>
    );

    const nextButton = (currentWeek !== week) && (
        <div className="week-header-next tiertary-light-background" onClick={weekNext}>
            <div className="week-arrow-next-icon secondary-color">
                <Icon name="chevron right" />
            </div>
        </div>
    )

    const weekButton = (weekNum: number) => {
        return (
            <div className="week-header tiertary-light-background" onClick={() => showWeeks(weekNum)}>
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