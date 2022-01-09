import React, { ReactElement, useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'

type Props = {
    clickEvent: (selected: any) => void,
    content: ReactElement | string,
    styling: string | null,
    type: string
}

export const PickButton = ({clickEvent, content, styling, type}: Props) => {

    const [typeClass, setTypeClass] = useState("secondary");

    useEffect(() => {
        switch(type) {
            case "secondary":
                setTypeClass("tiertary-light-background secondary-color " + styling);
                break;
            case "primary":
                setTypeClass("primary-background base-color " + styling);
                break;
            case "failure":
                setTypeClass("failure-color failure-light-background " + styling);
                break;
            default :
                setTypeClass("tiertary-light-background secondary-color " + styling);
        }
    }, [type, styling]);

    return (
        <Button className={typeClass} onClick={clickEvent}>
            {content}
        </Button>
    )
}