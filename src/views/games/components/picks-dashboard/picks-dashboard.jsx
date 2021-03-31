import React from 'react';
import { useSelector } from 'react-redux';
import { selectPicksIds } from '../../../../controller/picks/picksSlice';
import './picks-dashboard.css';
import { PickLoader } from '../../../../components/pick-loader/pick-loader';
import { PicksDashboardWrapper } from './picks-dashboard-wrapper';

export const PicksDashboard = () => {

    const pickIds = useSelector(selectPicksIds);
    const loader = useSelector((state) => state.picks.status);

    if(loader === 'loading' || pickIds === undefined) {
        return (
            <PickLoader />
        )
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