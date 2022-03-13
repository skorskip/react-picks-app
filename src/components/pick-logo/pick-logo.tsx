import React from 'react'
import '../pick-logo/pick-logo.css'

type Props = {
    sizeParam: string
}

export const PickLogo = ({sizeParam}: Props) => {
    const size = (param: string) => {
        switch(param) {
            case 'm': return 'medium';
            case 's': return 'small';
            case 'xs' : return 'xsmall'; 
            case 'l': return 'large'; 
            default: return 'small'; 
        }
    };

    return (
        <>
            <svg 
                className={size(sizeParam)} 
                xmlns="http://www.w3.org/2000/svg" 
                version="1.1" 
                width="100%" 
                viewBox="-0.5 -0.5 242 182">
                <defs/>
                <g>
                    <rect className="primary-fill" x="100" y="0" width="40" height="120" rx="20" ry="20" stroke="none" pointerEvents="none"/>
                    <rect className="primary-fill" x="50" y="0" width="40" height="110" rx="20" ry="20" stroke="none" pointerEvents="none"/>
                    <rect className="primary-fill" x="0" y="0" width="40" height="100" rx="20" ry="20" stroke="none" pointerEvents="none"/>
                    <rect className="secondary-fill" x="150" y="0" width="40" height="180" rx="20" ry="20" stroke="none" pointerEvents="none"/>
                    <path className="secondary-fill" d="M 200 55 L 200 30 Q 200 15 210.61 25.61 L 229.39 44.39 Q 240 55 229.39 65.61 L 210.61 84.39 Q 200 95 200 80 Z" fill="#455564" stroke="none" pointerEvents="none"/>
                </g>
            </svg>
        </>
    );
}