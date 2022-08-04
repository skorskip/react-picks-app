
import React, { useEffect, useState } from 'react';
import { Week } from '../../../../model/week/week';
import './schedule.css';

type Props = {
    week?: Week
}

export const Schedule = ({week} : Props) => {

    const events = () => {
        
    }
    
    return (
        <div className='schedule-container'>
            <h2 className='secondary-color'>
                Today
            </h2>
            <div className='schedule'>
                <div className='schedule-card secondary-color'>
                    <div className='schedule-topic secondary-color'>
                        7 games live
                    </div>
                    <div className='schedule-subtopic secondary-color'>
                        now
                    </div>
                </div>
                <div className='schedule-card warn-color'>
                    <div className='schedule-topic secondary-color'>
                        5 games starting
                    </div>
                    <div className='schedule-subtopic secondary-color'>
                        1:30 PM
                    </div>
                </div>
                <div className='schedule-card primary-color'>
                    <div className='schedule-topic secondary-color'>
                        NYG @ AZ
                    </div>
                    <div className='schedule-subtopic secondary-color'>
                        1:30 PM
                    </div>
                </div>
            </div>
        </div>
    );
}