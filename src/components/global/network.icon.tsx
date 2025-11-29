import React, {FC} from 'react';
import Icon from '@/components/global/icons';

interface NetworkIconProps {
    network: string;
    token: string;

    [key: string]: any;
}

const NetworkIcon: FC<NetworkIconProps> = ({network, token, className, miniClassName, ...otherProps}) => {
    return (
        <div className="relative">
            <Icon className={className ? className : "w-8"} name={token} {...otherProps} alt=""/>
            <div className="absolute p-0.5 bg-white -bottom-1 -right-1 rounded-full">
                <Icon className={miniClassName ? miniClassName : "w-3"} name={network} {...otherProps} alt=""/>
            </div>
        </div>
    );
};

export default NetworkIcon;
