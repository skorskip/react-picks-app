import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { PickLogo } from '../pick-logo/pick-logo';
import './nav-bar.css';

export const NavBar = () => {
    
    return (
        <div className="base-background nav-container">
            <Button.Group basic icon className="button-group">
                <Button>
                    <Icon size='large' name='football ball'/>
                </Button>
                <Button>
                    <Icon size='large' name='list'/>
                </Button> 
                <Button>
                    <Icon size='large' name='bullhorn'/>
                </Button>
                <Button>
                    <Icon size='large' name='address card outline' />
                </Button>
            </Button.Group>
        </div>
    );
}