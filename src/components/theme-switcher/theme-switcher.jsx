import React, {useState} from 'react';
import { SET_THEME } from '../../configs/topics';
import { Subscriber } from '../../utils/pubSub';
import { getThemeLocal } from '../../utils/localData';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(getThemeLocal() == null ? "light" : getThemeLocal());

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