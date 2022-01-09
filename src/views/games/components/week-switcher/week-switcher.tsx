import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { WEEK_SHOW_WEEKS } from '../../../../configs/topics';
import './week-switcher.css';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { toInt } from '../../../../utils/tools';
import { PickButton } from '../../../../shared/PickButton/PickButton';

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
        <PickButton clickEvent={weekPrev} styling="next-button-style" type="secondary" content={(
            <div className="week-arrow-next-icon">
                <Icon name="chevron left" />
            </div>
        )}/>
    );

    const nextButton = (currentWeek !== week) && (
        <PickButton clickEvent={weekNext} styling="next-button-style" type="secondary" content={(
            <div className="week-arrow-next-icon">
                <Icon name="chevron right" />
            </div>
        )}/>
    )

    const weekButton = (weekNum: number | null) => {
        return (
            <PickButton 
                key={weekNum + "-week-number"} 
                clickEvent={() => showWeeks(weekNum)} 
                styling="weeks-button-style" 
                type="secondary"
                content={(
                <div className="week-header">
                    <div className="week-title">
                        Week {weekNum}
                    </div>
                    <div className="week-arrow-icon">
                        {(weeksShown) ? (<Icon name="chevron down"/>) : (<Icon name="chevron up" />)}
                    </div>  
                </div>
            )}/>
        );
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