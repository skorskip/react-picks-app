import React, { useState } from 'react';
import { PickButton } from '../../../common/PickButton/PickButton';
import { getThemeLocal, setThemeLocal } from '../../../utils/localData';
import { themeList } from '../../../configs/themes';

type Props = {
    themeClickEvent: (newTheme: string) => void
}

export const Themes = ({themeClickEvent}:Props) => {

    const [theme, setTheme] = useState(getThemeLocal() === null ? "light" : getThemeLocal());

    const toggleTheme = (newTheme: string) => {
        setThemeLocal(newTheme)
        setTheme(newTheme);
        themeClickEvent(newTheme);
    }

    const themeListDisplay = themeList.map((item, i) => {
        return (
            <PickButton 
                key={i + item.value} 
                clickEvent={() => toggleTheme(item.value)} 
                styling="theme-button" 
                type={(theme === item.value ? "primary" : "secondary")}
                content={
                    <div className='theme-button-context'>
                        {item.name}
                    </div>
                }
            />
        )
    });

    const themes = (
        <div className="profile-card base-background tiertary-color">
            <div className="card-section secondary-color">
                <div className="info-header-profile">
                    Themes
                </div>
                <div className="info-content">
                    <div className="info-field">
                        <div className="theme-content">
                            { themeListDisplay }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <>
            {themes}
        </>
    );
}
