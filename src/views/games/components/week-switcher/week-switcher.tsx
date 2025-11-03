import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { ButtonType, PickButton } from '../../../../common/PickButton/PickButton';
import { League } from '../../../../model/league/league';
import { toInt } from '../../../../utils/tools';
import './week-switcher.css';

interface RouteParams {
    view: string
}

type Props = {
    league: League,
    filterList?: Array<{id: string, label: string}>,
}

export const WeekSwitcher = ({ league, filterList }: Props) => {

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

    const weekPrev = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week - 1) : 0}&user=${user}`);
    }

    const weekNext = () => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week ? (week + 1) : 0}&user=${user}`);
    }

    const filterClick = (filter: string) => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${week}&user=${user}&status=${filter}`);
    }

    const showWeeks = (weekNum: number | null) => {
        history.push(`/games/${param.view}?season=${season}&seasonType=${seasonType}&week=${weekNum}&user=${user}`);
    }

    const prevButton = (week !== 1) && (
        <PickButton clickEvent={weekPrev} styling="next-button-style" type={ButtonType.SECONDARY} content={(
            <div className="week-arrow-next-icon">
                <Icon name="chevron left" />
            </div>
        )}/>
    );

    const nextButton = (currentWeek !== week) && (
        <PickButton clickEvent={weekNext} styling="next-button-style" type={ButtonType.SECONDARY} content={(
            <div className="week-arrow-next-icon">
                <Icon name="chevron right" />
            </div>
        )}/>
    );

    const filterButton = ((currentWeek === week || week === null) && (user === 'null' || user === null)) && (
        <PickButton styling="next-button-style float-class" type={ButtonType.SECONDARY} content={(
            <>
                <div className="week-arrow-next-icon week-filter-icon">
                    <Icon name="filter" />
                </div>
                <select id="filters-select" className="week-filter-select" onChange={e => filterClick(e.target.value)}>
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
    );

    const weeksButton = () => {
        var weeksObject = [];
        for(let i = currentWeek; i > 0; i--) { 
            weeksObject.push(i);
        }
        return weeksObject;
    }

    const weekButton = (weekNum: number | null) => {
        return (
            <PickButton 
                key={weekNum + "-week-number"}
                styling="weeks-button-style" 
                type={ButtonType.SECONDARY}
                content={(
                    <>
                        <div className="week-header">
                            <div className="week-title">
                                Week {weekNum}
                            </div>
                            <div className="week-arrow-icon">
                                <Icon name="chevron down"/>
                            </div> 
                        </div>
                        <select id="weeks-select" className="weeks-button-icon" onChange={e => showWeeks(parseInt(e.target.value))}>
                            {
                                weeksButton()?.map(f => (
                                    <option key={'week-' + f} value={f} selected={week === f}>
                                        Week {f}
                                    </option>
                                ))
                            }
                        </select>
                    </>
            )}/>
        );
    };

    return (
        <div className="week-header-container">
            { prevButton }
            { weekButton(week) }
            { nextButton }
            { filterButton }
        </div>
    )
}