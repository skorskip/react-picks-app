import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { PickLogo } from '../../../../components/pick-logo/pick-logo';
import './nav-bar.css';

export const NavBar = () => {
    const {pathname} = useLocation();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : "" 
    
    const getIconClass = (link) => {
        return (link === route) ? "primary-color" : "secondary-color";
    }

    return (
        <div className="base-background nav-container">
            <div className="button-group">
                <Button icon basic className="nav-button">
                    <a href="/games/game" className="secondary-color">
                        <Icon size='large' name='slack'/>
                    </a>
                </Button>
                <Button icon basic className="nav-button">
                    <a href="/standings" className={getIconClass("standings")}>
                        <Icon size='large' name='list'/>
                    </a>
                </Button>
                <div className="logo-container">
                    <a href="/games/game">
                        <PickLogo sizeParam='xs'/>
                    </a>
                </div>
                <Button icon basic className="nav-button">
                    <a href="/messages" className={getIconClass("messages")}>
                        <Icon size='large' name='bullhorn'/>
                    </a>
                </Button>
                <Button icon basic className="nav-button">
                    <a href="/profile" className={getIconClass("profile")}>
                        <Icon size='large' name='address card outline' />
                    </a>
                </Button>
            </div>
        </div>
    );
}