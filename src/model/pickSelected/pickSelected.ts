import { Pick } from "../week/pick"

export class PickSelected {
    highlight: boolean
    pick: Pick

    constructor(highlight: boolean, pick: Pick) {
        this.highlight = highlight
        this.pick = pick
    }
} 