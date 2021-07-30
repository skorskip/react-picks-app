import React, {useState} from 'react';
import { of } from 'rxjs';
import { SET_THEME } from '../../configs/topics';
import { Subscriber } from '../../utils/pubSub';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') === null ? "light" : localStorage.getItem('theme'));

    const setNewTheme = (data) => {
        if(data !== null) {
            setTheme(data);
        }
    }

    return (
        <>
            <Subscriber topic={SET_THEME}>
                {data => (<>{setNewTheme(data)}</>)}
            </Subscriber>
            <link rel="stylesheet" href={"assets/themes/" + theme + "/styles-" + theme + ".css"} />
        </>
    ) 
}