import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { WEEK_SHOW_WEEKS } from '../../../../configs/topics';
import './week-switcher.css';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { toInt } from '../../../../utils/tools';

interface RouteParams {
    view: string
}

export const WeekSwitcher = () => {

    const history = useHistory();
    let param = useParams<RouteParams>();
    let { search } = useLocation();
    const league = useSelector(selectLeague);
    const query = new URLSearchParams(search);
    const currentWeek = league.currentWeek;
    const season = query.get("season") === null ? league.currentSeason : toInt(query.get("season"));
    const week = query.get("week") === null ? league.currentWeek : toInt(query.get("week"));
    const seasonType = query.get("seasonType") === null ? league.currentSeasonType : toInt(query.get("seasonType"));
    const user = query.get("user");
    const [weeksShown, setWeeksShown] = useState(false);
    const dispatch = useDispatch();

    const weekPrev = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week - 1) : 0}&user=${user}`);
    }

    const weekNext = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week + 1) : 0}&user=${user}`);
    }

    const showWeeks = (weekNum: number | null) => {
        if(weeksShown) {
            history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${weekNum}&user=${user}`);
            setWeeksShown(false);
            dispatch(publish(new PubSub(WEEK_SHOW_WEEKS, false)));
        } else {
            setWeeksShown(true);
            dispatch(publish(new PubSub(WEEK_SHOW_WEEKS, true)));
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

    const weekButton = (weekNum: number | null) => {
        return (
            <div key={weekNum + "-week-number"} className="week-header tiertary-light-background" onClick={() => showWeeks(weekNum)}>
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