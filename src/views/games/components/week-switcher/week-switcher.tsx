import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './week-switcher.css';
import { toInt } from '../../../../utils/tools';
import { PickButton } from '../../../../common/PickButton/PickButton';
import { League } from '../../../../model/league/league';

interface RouteParams {
    view: string
}

type Props = {
    league: League,
    filterList?: Array<{id: string, label: string}>, 
    showWeekEvent: (showWeek:boolean) => void,
}

export const WeekSwitcher = ({ league, showWeekEvent, filterList }: Props) => {

    const history = useHistory();
    let param = useParams<RouteParams>();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const currentWeek = league.currentWeek;
    const season = query.get("season") === null ? league.currentSeason : toInt(query.get("season"));
    const week = query.get("week") === null ? league.currentWeek : toInt(query.get("week"));
    const seasonType = query.get("seasonType") === null ? league.currentSeasonType : toInt(query.get("seasonType"));
    const user = query.get("user");
    const filter = query.get("status");
    const [weeksShown, setWeeksShown] = useState(false);

    const weekPrev = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week - 1) : 0}&user=${user}`);
    }

    const weekNext = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week + 1) : 0}&user=${user}`);
    }

    const filterClick = (filter: string) => {
        console.log('filter:::', filter);
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week}&user=${user}&status=${filter}`);
    }

    const showWeeks = (weekNum: number | null) => {
        if(weeksShown) {
            history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${weekNum}&user=${user}`);
            setWeeksShown(false);
            showWeekEvent(false)
        } else {
            setWeeksShown(true);
            showWeekEvent(true);
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
    );

    const filterButton = ((currentWeek === week || week === null) && (user === 'null' || user === null)) && (
        <PickButton styling="next-button-style" type="secondary" content={(
            <>
                <div className="week-arrow-next-icon">
                    <Icon name="filter" />
                </div>
                <select className="week-filter-icon" onChange={e => filterClick(e.target.value)}>
                    <option value="">All Statuses</option>
                    {
                        filterList?.map(f => (
                            <option key={f.id} value={f.id} selected={filter === f.id}>
                                {f.label}
                            </option>
                        ))
                    }
                </select>
                { (filter) ? (<div className="week-filter-notif failure-background"></div>) : (<></>)}
            </>
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
            { filterButton }
        </div>
    )
}