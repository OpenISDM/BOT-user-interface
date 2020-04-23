import React from 'react';
import {
    PrimaryButton
} from './styleComponent'

const IconButton = ({
    iconName,
    children,
    name,
    onClick
}) => {
    return (
        <PrimaryButton
            variant="outline-primary"
            name={name}
            onClick={onClick}
        >
            <i className={`${iconName} mx-1`}></i>
            {children}
        </PrimaryButton>
    )
}

export default IconButton