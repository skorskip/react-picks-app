
import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { Game, GameStatusEnum } from '../../../../model/week/game';
import { Pick } from '../../../../model/week/pick';
import { Team } from '../../../../model/week/team';
import { formatDate } from '../../../../utils/dateFormatter';
import './schedule.css';

type Props = {
    games: Array<Game>;
    picks: Array<Pick>;
    teams: Array<Team>;
}

interface ScheduleCard {
    type: string;
    subTitle: string;
    time: string;
    title: string;
    icon: SemanticICONS;
}

export const Schedule = ({games, picks, teams} : Props) => {

    const [schedules, setSchedule] = useState([] as ScheduleCard[]);
    const [pickSchedules, setPickSchedules] = useState([] as ScheduleCard[]);
    const [liveSchedules, setLiveSchedules] = useState([] as ScheduleCard[]);
    const [submitSchedules, setSubmitSchedules] = useState([] as ScheduleCard[]);
    const [filteredGames, setFilteredGames] = useState([] as Game[]);
    const [eventDay, setEventDay] = useState(new Date());

    useEffect(() => {
        const currentGames = games.filter(game => game.game_status !== GameStatusEnum.completed);

        if (!!currentGames.length) {
            const firstGame = currentGames[0];
            const gameDay = new Date(firstGame.start_time);
            let filtered = currentGames.filter(game => {
                console.log(new Date(game.start_time).getDate(), gameDay.getDate())
                return new Date(game.start_time).getDate() === gameDay.getDate()
            });
            console.log(gameDay, filtered);
            setEventDay(gameDay);
            setFilteredGames(filtered);
        }
    }, [games]);

    // Get Live Games
    useEffect(() => {
        const liveGames = filteredGames.filter(games => games.game_status === GameStatusEnum.live);
        if (!!liveGames.length) {
            const liveSchedule = {
                type: 'secondary-color',
                subTitle: `${liveGames.length} games`,
                time: 'now',
                title: 'Game(s) live',
                icon: 'football ball'
            } as ScheduleCard;
    
            setLiveSchedules([liveSchedule]);
        }
    }, [filteredGames]);

    // Get Submit Times 
    useEffect(() => {
        const unplayedGames = filteredGames.filter(games => games.game_status === GameStatusEnum.unplayed);
        
        let submitMap = {} as any;
        unplayedGames.forEach(game => {
            if (!submitMap[game.pick_submit_by_date]) { 
                submitMap[game.pick_submit_by_date] = []; 
            }
            submitMap[game.pick_submit_by_date].push(game.game_id);
        });
        const keys = Object.keys(submitMap);
        let unplayedSchedule = [] as ScheduleCard[];

        keys.forEach((key: string) => {
            unplayedSchedule.push({
                type: 'warn-color',
                subTitle: `${submitMap[key].length} games`,
                time: new Date(key).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                title: 'Submit deadline(s)',
                icon: 'clock'
            });
        });

        setSubmitSchedules([...unplayedSchedule]);
    }, [filteredGames]);

    // Get Picked Games
    useEffect(() => {
        const pickGamesId = picks.map(pick => pick.game_id);
        const pickGames = filteredGames.filter(game => pickGamesId.includes(game.game_id));
        const pickSchedule = [] as ScheduleCard[];
        pickGames.forEach(game => {
            let awayTeam = teams.find(team => team.team_id === game.away_team_id);
            let homeTeam = teams.find(team => team.team_id === game.home_team_id);
            pickSchedule.push({
                type: 'primary-color',
                subTitle: `${awayTeam?.abbreviation} @ ${homeTeam?.abbreviation}`,
                time: new Date(game.start_time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                title: 'Pick',
                icon: 'hand point down'
            });
        });
        setPickSchedules([...pickSchedule]);
    }, [filteredGames]);

    useEffect(() => {
        const schedules = [...pickSchedules, ...submitSchedules];
        setSchedule([...liveSchedules, ...schedules.sort((a,b) => { if (a.time > b.time) {return 1;} else {return -1}})]);
    }, [pickSchedules, liveSchedules, submitSchedules]);

    // if(!!schedules && !!schedules.length) {
    //     return (<><div>Empty</div></>)
    // }

    const schedulesDisplay = schedules.map((schedule,i) => {
        return (
            <div key={i + '-schedule-card'} className={'schedule-card ' + schedule.type}>
                <div className='schedule-header'>
                    <div className='schedule-topic secondary-color'>
                        <Icon name={schedule.icon}/>
                        {schedule.title}
                    </div>
                    <div className='schedule-subtopic secondary-color'>
                        {schedule.subTitle}
                    </div>
                </div>
                <div>
                    {schedule.time}
                </div>
            </div>
        );
    })
    
    return (
        <div className='schedule-container'>
            <div className='sub-title secondary-color'>
                {formatDate(eventDay, true)}
            </div>
            <div className='schedule'>
                {schedulesDisplay}
            </div>
        </div>
    );
}