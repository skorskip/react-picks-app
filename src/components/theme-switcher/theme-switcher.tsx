import React, {useState} from 'react';
import { SET_THEME } from '../../configs/topics';
import { Subscriber } from '../../utils/pubSub';
import { getThemeLocal } from '../../utils/localData';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<String | null>(getThemeLocal() == null ? "light" : getThemeLocal());

    const setNewTheme = (data: String | any) => {
        if(data !== null) {
            setTheme(data);
        }
    }

    return (
        <>
            <Subscriber topic={SET_THEME}>
                {(data: any) => (<>{setNewTheme(data)}</>)}
            </Subscriber>
            <link rel="stylesheet" href={"assets/themes/" + theme + "/styles-" + theme + ".css"} />
        </>
    ) 
}