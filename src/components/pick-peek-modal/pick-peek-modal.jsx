import React, { useState,useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { Team } from '../game/components/team/team';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { fetchPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { SHOW_MODAL, Subscriber, publish } from '../../utils/pubSub';
import "./pick-peek-modal.css";
import { GameLoader } from '../game-loader/game-loader';
import { useHistory } from 'react-router-dom';
import { status } from '../../configs/status';

export const PickPeekModal = () => {
    
    const [showModal, setShowModal] = useState(false);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);
    const userPicks = useSelector(selectPicksForUser);
    const userPicksState = useSelector((state) => state.picksForUser.status);
    const [userData, setUserData] = useState({user_id: '', first_name: '', last_name: '', user_inits: ''});
    const dispatch = useDispatch();
    const history = useHistory();

    const showModalSub = (data) => {
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
        history.push(`/games/others?season=${league.currentSeason}&seasonType=${league.currentSeasonType}&week=${league.currentWeek}&user=${userData.user_id}`);
        closeClick();
    }

    const modalHeader = (
        <div className="modal-header primary-background" onClick={() => closeClick()}>
            <div className="close-modal-icon base-color">
                <Icon name="times"/>
            </div>
            <div className="base-color week-title">Week {league.currentWeek} Picks</div>
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
        <div class="modal-title">
            <Button icon labelPosition='right' className="view-picks-button tiertary-light-background secondary-color" onClick={() => viewPicks()}>
                <div class="card-header-text">
                    {userData.first_name} {userData.last_name}
                </div>
                <Icon name="chevron right" className="secondary-color"/>      
            </Button>
        </div>
    )

    const userPicksLoading = (userPicksState === 'loading') && (
        <GameLoader height="50" count="4"/>
    )

    const userPicksNone = (userPicksState === 'complete' && userPicks.length === 0) && (
        <div className="picks-none-container">   
            No Picks
        </div>
    ) 

    const userPicksContent = (userPicksState === 'complete') && userPicks.map((pick) => {
        return(
            <div className="teams-container">
                <div className="team-picks">
                    <Team
                        team={pick.awayTeam}
                        locked={false}
                        size="medium"
                        highlight={pick.awayTeam.team_id === pick.pick.team_id}
                    />
                    <div className="quaternary-background game-icon-container">
                        <div className="secondary-color game-icon">
                            @
                        </div>
                    </div>
                    <Team
                        team={pick.homeTeam}
                        locked={false}
                        size="medium"
                        highlight={pick.homeTeam.team_id === pick.pick.team_id}
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
            dispatch(fetchPicksForUser({userId: userData.user_id, season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [userData.user_id, leagueState, league, dispatch]);


    return (
        <>
            <Subscriber topic={SHOW_MODAL}>
                {data => (<>{showModalSub(data)}</>)}
            </Subscriber>
            { userModal }
        </>
    );
}