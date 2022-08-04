
import React from 'react';
import './picks-quick.css';

export const PicksQuick = () => {

    const pickQuick = (
        <div className='picks-quick-card tiertary-light-background'>
            <div className='picks-quick-info'>
                <div className='picks-quick-topic'>
                    <div className='team-title primary-background'>
                        <div className='base-color'>NYG</div>
                    </div>
                    <div className='team-title'>@</div>
                    <div className='team-title'> 
                        AZ
                    </div>
                </div>
                <div className='picks-quick-subtopic'>
                    1:30 PM
                </div>
            </div>
            <div className='picks-quick-spread secondary-color'>
                +4
            </div>
        </div>
    );

    return (
        <div className='picks-quick-container'>
            <h2>
                Picks
            </h2>
            <div className='picks-quick'>
                { pickQuick }
                { pickQuick }
                { pickQuick }
                { pickQuick }
            </div>
        </div>
    );
}