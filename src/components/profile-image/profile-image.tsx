import React from 'react'
import "../profile-image/profile-image.css"

type Props = {
    content: string | number,
    image: string | null,
    size: string,
    showImage: boolean
}

export const ProfileImage = ({content, image, size, showImage}: Props) => {
    const sizeClass = (size: string) => {
        switch(size) {
            case 'xs' : return 'x-small-image';
            case 'm': return 'medium-image';
            case 's': return 'small-image';
            case 'l': return 'large-image'; 
            default: return 'small-image'; 
        }
    };

    const initsProfile = (!showImage || image == null) && (
        <div className="image-container">
            <div className={"image-icon base-color primary-background " + sizeClass(size)}>
                { content }
            </div>
        </div>
    );

    const imageProfile = (showImage && image != null) && (
        <div className="image-container">
            <img className={"image-icon base-color " + sizeClass(size)} src={image} alt=""/>
        </div>
    );

    return (
        <>
            {initsProfile}
            {imageProfile}
        </>
    );
}