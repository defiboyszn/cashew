// noinspection TypeScriptValidateTypes

import React, {useEffect, useRef, useState} from "react";
import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options
} from "qr-code-styling";

interface QrCodeComponentProps {
    data: string; // Required data prop
    url?: string; // Optional image URL prop
    width?: number; // Optional image URL prop
    height?: number; // Optional image URL prop
}

const QrCodeComponent: React.FC<QrCodeComponentProps> = ({data, url, width = 200, height = 200}) => {
    const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Set options whenever the data or url prop changes
        const options: Options = {
            width,
            height,
            type: 'svg' as DrawType,
            data,
            image: url,
            qrOptions: {
                typeNumber: 0 as TypeNumber,
                mode: 'Byte' as Mode,
                errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
            },
            imageOptions: {
                hideBackgroundDots: false,
                imageSize: 0.65,
                margin: 5,
                crossOrigin: 'anonymous',
            },
            dotsOptions: {
                color: '#222222',
                type: 'extra-rounded' as DotType
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            cornersSquareOptions: {
                color: '#222222',
                type: 'extra-rounded' as CornerSquareType,
            },
            cornersDotOptions: {
                color: '#222222',
                type: 'dot' as CornerDotType,
            }
        };

        qrCode.update(options);

        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, [data, url, qrCode]);

    return (
        ref ? <div className="qr-container" ref={ref}/> :
            <div className="bg-gray-200 h-[200px] w-[200px] rounded-lg animate-pulse"></div>
    );
};

export default QrCodeComponent;
