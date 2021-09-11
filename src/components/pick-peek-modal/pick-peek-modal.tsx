import React, { useState,useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { TeamCard } from '../game-card/components/team-card/team-card';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { fetchPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { SHOW_MODAL, Subscriber, publish } from '../../utils/pubSub';
import "./pick-peek-modal.css";
import { GameLoader } from '../game-loader/game-loader';
import { useHistory, useLocation } from 'react-router-dom';
import { status } from '../../configs/status';
import { PickStatus } from '../game-card/components/pick-staus/pick-status';
import { GameWinStatusEnum, GameStatusEnum } from '../../model/game/game';
import { RootState } from '../../store';
import { UserStanding } from '../../model/userStanding/userStanding';
import { Pick } from '../../model/pick/pick';
import { PickRequest } from '../../model/postRequests/pickRequest';
import { PicksUser } from '../../model/picksUser/picksUser';

export const PickPeekModal = () => {
    
    const [showModal, setShowModal] = useState(false);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state: RootState) => state.league.status);
    const userPicks = useSelector(selectPicksForUser);
    const userPicksState = useSelector((state: RootState) => state.picksForUser.status);
    const [userData, setUserData] = useState({user_id: '', first_name: '', last_name: '', user_inits: ''});
    const dispatch = useDispatch();

    const history = useHistory();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const season = query.get("season") === null ? league.currentSeason : query.get("season");
    const week = query.get("week") === null ? league.currentWeek : query.get("week")
    const seasonType = query.get("seasonType") === null ? league.currentSeasonType : query.get("seasonType");

    const showModalSub = (data: any) => {
        setShowModal(data !== null);
        if(data !== null) {
            setUserData(data)
        }
    }

    const closeClick = () => {
        setShowModal(false);
        publish(SHOW_MODAL, null);
    }

    const viewPicks = () => {
        history.push(`/games/others?season=${season}&seasonType=${seasonType}&week=${week}&user=${userData.user_id}`);
        closeClick();
    }

    const pickResult = (pick: PicksUser) => {
        if(pick.game_status === GameStatusEnum.completed && pick != null){
            if(pick.pick.team_id === pick.winning_team_id) {
              return GameWinStatusEnum.win;
            } else if(pick.winning_team_id === null) {
              return GameWinStatusEnum.push;
            } else {
              return GameWinStatusEnum.loss;
            }
          }
          else {
            return null;
          }
    }

    const modalHeader = (
        <div className="modal-header tiertary-background" onClick={() => closeClick()}>
            <div className="close-modal-icon secondary-color">
                <Icon name="times"/>
            </div>
            <div className="secondary-color week-modal-title"><b>Week {week} Picks</b></div>
        </div>
    );

    const modalInitIcon = (
        <div className="modal-init">
            <div className="init-icon base-color primary-background">
                { userData.user_inits }
            </div>
        </div>
    );

    const modalTitle = (
        <div className="modal-title">
            <Button icon labelPosition='right' className="view-picks-button tiertary-light-background secondary-color" onClick={() => viewPicks()}>
                <div className="card-header-text">
                    {userData.first_name} {userData.last_name}
                </div>
                <Icon name="chevron right" className="secondary-color"/>      
            </Button>
        </div>
    )

    const userPicksLoading = (userPicksState === 'loading') && (
        <GameLoader height={50} count={4}/>
    )

    const userPicksNone = (userPicksState === 'complete' && userPicks.length === 0) && (
        <div className="picks-none-container">   
            No Picks
        </div>
    ) 

    const userPicksContent = (userPicksState === 'complete') && userPicks.map((pick: PicksUser) => {
        return(
            <div className="teams-container">
                <div className="team-picks">
                    <TeamCard
                        team={pick.awayTeam}
                        locked={false}
                        size="medium"
                        highlight={pick.awayTeam.team_id === pick.pick.team_id}
                        disabled={true}
                        score={null}
                        fill={null}
                        spread={null}
                        onTeamSelected={()=>null}
                    />
                    <PickStatus 
                        submitTime={pick?.pick_submit_by_date}
                        pickSuccess={pickResult(pick)}
                        gameStatus={pick?.game_status} 
                    />
                    <TeamCard
                        team={pick.homeTeam}
                        locked={false}
                        size="medium"
                        highlight={pick.homeTeam.team_id === pick.pick.team_id}
                        disabled={true}
                        score={null}
                        fill={null}
                        spread={null}
                        onTeamSelected={()=>null}
                    />
                </div>
            </div>
        )
    })

    const modalContent = (
        <div className="modal-content">
            { userPicksLoading }
            { userPicksNone }
            { userPicksContent }
        </div>
    )

    const userModal = (showModal) && (
        <Modal
            onClose={() => closeClick()}
            open={showModal}
            className="base-background secondary-color"
        >
            { modalHeader }
            { modalInitIcon }
            { modalTitle }
            { modalContent }
        </Modal>
    );

    useEffect(() => {
        if(leagueState === status.COMPLETE && userData.user_id !== "") {
            let request = new PickRequest(season, seasonType, week, userData.user_id, null);
            dispatch(fetchPicksForUser(request));
        }
    }, [userData.user_id, leagueState, league, dispatch]);


    return (
        <>
            <Subscriber topic={SHOW_MODAL}>
                {(data: any) => (<>{showModalSub(data)}</>)}
            </Subscriber>
            { userModal }
        </>
    );
}