import React, { useEffect, useState } from 'react';
import { Schedule } from './components/schedule/schedule';
import { Grid } from 'semantic-ui-react';
import './dashboard.css';
import { PicksQuick } from './components/picks-quick/picks-quick';

export const Dashboard = () => {

    const header = () => {
        const today = new Date();
        return (today.getHours() >= 12) ? (
                <div className="title secondary-color">
                    Good Afternoon.
                </div>
            ) : (
                <div className="title secondary-color">
                    Good Morning!
                </div>
            )
    };


    return (
        <>
            {header()}
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Schedule></Schedule>
                    </Grid.Column>
                    <Grid.Column>
                        <PicksQuick></PicksQuick>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </>
    );
}