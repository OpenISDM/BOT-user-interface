import React, { Fragment } from 'react';
import { 
    Field, 
} from 'formik';
import {
    FieldLabel
} from './styleComponent'

const BOTValueField = ({
   label,
   value,

}) => {

    return (
        <Fragment>
            <FieldLabel>
                {label}
            </FieldLabel>
            <Field 
                type="text"
                value={value}
                label={label}
                disabled={true}
                style={{
                    border: 'none',
                    letterSpacing: '1.5px',
                }}
            />
        </Fragment>
    )
}



export default BOTValueField;