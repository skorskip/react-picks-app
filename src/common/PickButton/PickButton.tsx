import React, { ReactElement, useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'

export enum ButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TOGGLE = 'toggle',
    FAILURE = 'failure'
}

type Props = {
    clickEvent?: (selected: any) => void,
    content?: ReactElement | string,
    styling?: string | null,
    type: ButtonType,
    loading?: boolean | null
}

export const PickButton = ({clickEvent, content, styling, type, loading}: Props) => {

    const [typeClass, setTypeClass] = useState("secondary");

    const button = (loading) ? (
        <Button 
            className={typeClass} 
            loading
        >
            {content}
        </Button>
     ) : (
        <Button 
            className={typeClass} 
            onClick={clickEvent}
        >
            {content}
        </Button>
     )

    useEffect(() => {
        switch(type) {
            case ButtonType.TOGGLE:
                setTypeClass("tiertary-light-background secondary-color " + styling);
                break;
            case ButtonType.SECONDARY:
                setTypeClass("tiertary-light-background secondary-color tiertary-border " + styling);
                break;
            case ButtonType.PRIMARY:
                setTypeClass("primary-background base-color primary-border " + styling);
                break;
            case ButtonType.FAILURE:
                setTypeClass("failure-background base-color failure-border " + styling);
                break;
            default :
                setTypeClass("tiertary-light-background secondary-color " + styling);
        }
    }, [type, styling]);

    return (
        <>
            {button}
        </>
    )
}