import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { selectPicksIds, selectPicks } from '../../../../controller/picks/picksSlice';
import './picks-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state) => state.picks.status);
    const picks = useSelector(selectPicks);

    const [updatePicks, setUpdatePicks] = useState([]);
    const [deletePicks, setDeletePicks] = useState([]); 

    if(loader === 'loading' || pickIds === undefined) {
        return (
            <PickLoader />
        )
    }

    const teamSelected = (event) => {
        const updatePick = picks.find((pick) => pick.game_id === event.gameId);

        if(event.highlight) {
            let tempUpdate = updatePicks;
            updatePick.team_id = event.teamId;
            tempUpdate.push(updatePick);
            setUpdatePicks(tempUpdate);
        } else {
            let tempDelete = deletePicks;
            tempDelete.push(updatePick);
            setDeletePicks(tempDelete);
        }
    }   

    const noPicks = pickIds.size === 0 && (
        <div className="no-games-set secondary">
            No Picks made
        </div>
    );

    const games = pickIds.map((pickId, index) => {
        return(
            <PicksDashboardWrapper
                key={pickId}
                id={pickId} 
                previousId={pickIds[index - 1]}
                index={index}
                onTeamSelected={teamSelected}
            />
        )
    });

    return (
        <div className="games-container">
            { noPicks }
            { games }
        </div>
    );
} 