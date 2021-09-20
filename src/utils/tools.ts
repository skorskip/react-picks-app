export const toInt = (convert: string | null) => {
    if(convert) {
        let converted = parseInt(convert);
        if(isNaN(converted)) {
            return null;
        }
        return converted;
    } else {
        return null;
    }
}