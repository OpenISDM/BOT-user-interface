import React from 'react';
import {
    PrimaryButton
} from './styleComponent'

const IconButton = ({
    iconName,
    children
}) => {
    return (
        <PrimaryButton
            variant="outline-primary"
        >
            <i className={`${iconName} mx-1`}></i>
            {children}
        </PrimaryButton>
    )
}

export default IconButton