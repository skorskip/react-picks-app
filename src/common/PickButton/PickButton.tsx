import React, { ReactElement, useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'

type Props = {
    clickEvent?: (selected: any) => void,
    content?: ReactElement | string,
    styling?: string | null,
    type: string,
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
            case "secondary":
                setTypeClass("tiertary-light-background secondary-color tiertary-border " + styling);
                break;
            case "primary":
                setTypeClass("primary-background base-color primary-border " + styling);
                break;
            case "failure":
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