import React, { ReactElement } from 'react'
import { Button } from 'semantic-ui-react'

type Props = {
    clickEvent: (selected: any) => void,
    content: ReactElement,
    styling: string | null
}

export const PickButton = ({clickEvent, content, styling}: Props) => {
    return (
        <Button className={"tiertary-light-background " + styling} onClick={clickEvent}>
            {content}
        </Button>
    )
}