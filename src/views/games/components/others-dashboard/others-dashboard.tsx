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
import { RootState } from "../../../../store";
import { PickRequest } from "../../../../model/postRequests/pickRequest";
import { publish, PubSub } from "../../../../controller/pubSub/pubSubSlice";
import { SHOW_MESSAGE } from "../../../../configs/topics";
import { SnackMessage } from "../../../../components/message/messagePopup";

export const OthersDashboard = () => {
    const dispatch = useDispatch();
    let { search } = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(search);
    const season = parseInt(query.get("season") || "");
    const week = parseInt(query.get("week") || "");
    const seasonType = parseInt(query.get("seasonType") || "");
    const user = parseInt(query.get("user") || "");
    const userInfo = useSelector((state: RootState) => userStandingById(state, user));
    const standingsStatus = useSelector((state: RootState) => state.userStandings.status);
    const league = useSelector(selectLeague);
    const leagueStatus = useSelector((state:RootState) => state.league.status);

    const goBack = () => {
        history.goBack();
    }

    useEffect(() => {
        if(standingsStatus === status.IDLE && leagueStatus === status.COMPLETE) {
            dispatch(fetchUserStandings({season: league.currentSeason, seasonType: league.currentSeasonType, week: league.currentWeek}));
        } else if(standingsStatus === status.ERROR) {
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }
    }, [dispatch, standingsStatus, leagueStatus, league]);


    useEffect(() => {
        if(user != null && week != null && season != null && seasonType != null) {
            let request = new PickRequest(season, seasonType, week, user, [])
            dispatch(fetchUsersPicks(request))
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