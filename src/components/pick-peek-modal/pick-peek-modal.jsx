import React, { useState,useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { Team } from '../game/components/team/team';
import { selectLeague } from '../../controller/league/leagueSlice';
import { selectPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { fetchPicksForUser } from '../../controller/picks-for-user/picksForUserSlice';
import { SHOW_MODAL, Subscriber, publish } from '../../utils/pubSub';
import "./pick-peek-modal.css";

export const PickPeekModal = ({
    firstname,
    lastname,
    inits,
    userId
}) => {
    
    const [showModal, setShowModal] = useState(false);
    const league = useSelector(selectLeague);
    const leagueState = useSelector((state) => state.league.status);
    const userPicks = useSelector(selectPicksForUser);
    const dispatch = useDispatch();

    const showModalSub = (data) => {
        setShowModal(data);
    }

    const closeClick = () => {
        setShowModal(false);
        publish(SHOW_MODAL, false);
    }

    const viewPicks = () => {
        console.log("VIEW PICKS")
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
                { inits }
            </div>
        </div>
    );

    const modalTitle = (
        <div class="modal-title-modal">
            <Button className="view-picks-button secondary-color" onClick={() => viewPicks()}>
                <div class="card-header-text">
                    {firstname} {lastname}
                </div>            
            </Button>
        </div>
    )

    const userPicksContent = userPicks.map((pick) => {
        return(
            <div className="teams-container">
                <div className="team-picks">
                    <Team
                        team={pick.awayTeam}
                        locked={false}
                        size="medium"
                        highlight={pick.awayTeam.team_id === pick.pick.team_id}
                    />
                    <div className="tiertary-colo game-icon">
                        @
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
            { userPicksContent }
        </div>
    )

    const userModal = (showModal) && (
        <div className="modal-container" id="modal-container">
            <div className="user-modal base-background secondary-color" id="user-modal">
                { modalHeader }
                { modalInitIcon }
                { modalTitle }
                { modalContent }
            </div>
        </div>
    );

    useEffect(() => {
        if(leagueState === 'complete') {
            dispatch(fetchPicksForUser({userId: userId, season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [userId, leagueState, league]);


    return (
        <>
            <Subscriber topic={SHOW_MODAL}>
                {data => (<>{showModalSub(data)}</>)}
            </Subscriber>
            { userModal }
        </>
    );
}