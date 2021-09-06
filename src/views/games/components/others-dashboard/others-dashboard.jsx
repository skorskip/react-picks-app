import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from 'react-router-dom';
import { fetchUsersPicks } from "../../../../controller/picks/picksSlice";
import { PicksDashboard } from "../picks-dashboard/picks-dashboard";
import { userStandingById, fetchUserStandings } from "../../../../controller/user-standings/userStandingsSlice";
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { status } from '../../../../configs/status';
import "./others-dashboard.css";
import { Icon } from "semantic-ui-react";

export const OthersDashboard = () => {
    const dispatch = useDispatch();
    let { search } = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(search);
    const season = query.get("season");
    const week = query.get("week");
    const seasonType = query.get("seasonType");
    const user = query.get("user");
    const userInfo = useSelector((state) => userStandingById(state, parseInt(user)));
    const standingsStatus = useSelector((state) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueStatus = useSelector((state) => state.league.status);

    const goBack = () => {
        history.goBack();
    }

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        }
    }, [dispatch, standingsStatus, leagueStatus, league]);

    useEffect(() => {
        if(user != null && week != null && season != null && seasonType != null) {
            dispatch(fetchUsersPicks({user: user, week: week, seasonType: seasonType, season: season}))
        }
    }, [user, week, season, seasonType, dispatch]);

    return (
        <>
            {
                (user != null && week != null && season != null && seasonType != null && userInfo != null) ? (
                    <>
                        <div className="other-user-info-container" onClick={goBack}>
                            <div className="other-user-info tiertary-color base-background">
                                <Icon name="chevron left" className="secondary-color"/>
                                <div className="secondary-color other-user-name">
                                    <Icon name="user" className="secondary-color"/>
                                    {userInfo.first_name}&nbsp;{userInfo.last_name}
                                </div>
                            </div>
                        </div>
                        <PicksDashboard />
                    </>
                ) : (
                    <div className="no-games-set secondary-color">
                        No Picks for this user.
                    </div>
                )
            }
        </>
    );
}