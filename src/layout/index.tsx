import localFont from '@next/font/local'
import React from "react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import {defaultNetwork, networkSettings} from "@/app/config/settings";
// import { block } from 'million/react';


const GTWalsheimPro = localFont({
    src: [
        {
            path: '../../public/fonts/GTWalsheimPro-Thin.ttf',
            weight: '100'
        },
        {
            path: '../../public/fonts/GTWalsheimPro-Black.ttf',
            weight: '900'
        },
        {
            path: '../../public/fonts/GTWalsheimPro-Bold.ttf',
            weight: '700'
        },
        {
            path: '../../public/fonts/GTWalsheimPro-Medium.ttf',
            weight: '500'
        },
        {
            path: '../../public/fonts/GTWalsheimPro-Regular.ttf',
            weight: '400'
        },
        {
            path: '../../public/fonts/GTWalsheimPro-Light.ttf',
            weight: '300'
        }
    ],
    variable: '--font-gt-walsheim-pro'
})

const RootLayout = (function RootLayout({children}: { children: React.ReactNode }) {

    useLocalStorage<any>('network', networkSettings[defaultNetwork]);

    return (
        <div className={`${GTWalsheimPro.variable} font-sans text-cgray-500`}>
            {children}
        </div>
    )
})

export default RootLayout;