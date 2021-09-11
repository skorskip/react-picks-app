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
                viewBox="-0.5 -0.5 242 182" 
                content="&lt;mxfile host=&quot;www.draw.io&quot; modified=&quot;2019-10-25T01:26:03.986Z&quot; agent=&quot;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36&quot; version=&quot;12.1.5&quot; etag=&quot;LVl5lWvPVP4aQ_QPm4DW&quot; type=&quot;google&quot; pages=&quot;1&quot;&gt;&lt;diagram id=&quot;XtqjSZo8QE_EY0ptDfD3&quot;&gt;3ZaxboMwEEC/hh0wTukKSdulU4bOFr6AVWMjxymkX18TbAhNUSJEMnRB8O4O2+9OAg+lZfOqSFW8SwrcC33aeGjtheHzU2SuLTh2AKO4A7litEPBALbsGyz0LT0wCvtRopaSa1aNYSaFgEyPGFFK1uO0neTjVSuSwwXYZoRf0g9GddHRGPsDfwOWF27lwLeRkrhkC/YFobI+Q2jjoVRJqbu7skmBt+6cl67uZSLab0yB0LcUhF3BF+EHeza7L310h1XyICi0+YGHkrpgGrYVydpobbprWKFLbsM7xnkquVSnWoQ2eJ2ahZO9VvITXERIYcoTojLbW2MOJXYroDQ0k8cJeklmuECWoNXRpLiC2Hq1g4Wc+HpoU2RRcd4h1w9iJyPvXz3IMzfW398u0Z1dAqZt5sNcopkugwVcRv9rLueOpb+ASnxflRHGeBU9TmU4dyzjBVyurrvUihGRt0/XRI6t918Cf8rllPjBMVrK8e95DfBNjmcoNo/D1+4UO/tlQJsf&lt;/diagram&gt;&lt;/mxfile&gt;">
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