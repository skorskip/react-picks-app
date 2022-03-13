import React, {useEffect, useState} from 'react';
import { SET_THEME } from '../../configs/topics';
import { getThemeLocal } from '../../utils/localData';
import { useDispatch, useSelector } from 'react-redux';
import { clear, subscribe } from '../../controller/pubSub/pubSubSlice';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<String | null>(getThemeLocal() == null ? "light" : getThemeLocal());
    const sub = useSelector(subscribe);
    const dispatch = useDispatch();

    const setNewTheme = (data: String | any) => {
        if(data !== null) {
            setTheme(data);
        }
    }

    useEffect(() => {
        if(sub.topic === SET_THEME) {
            setNewTheme(sub.data);
            dispatch(clear());
        }
    }, [sub, dispatch]);

    return (
        <link rel="stylesheet" href={"assets/themes/" + theme + "/styles-" + theme + ".css"} />
    ) 
}