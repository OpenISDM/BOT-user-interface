import React, { Fragment } from 'react';
import { 
    Field, 
    ErrorMessage 
} from 'formik';
import {
    FormFieldName,
    FieldLabel
} from '../../config/styleComponent'

const BOTFormikField = ({
   name = "default",
   label,
   error,
   touched,
   type = 'text',
   disabled,
   placeholder,
   component,
   display = true,
   className, 
   value,
   onChange,
   example = null,
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



export default BOTFormikField;