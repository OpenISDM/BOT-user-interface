import React from 'react';
import { 
    Field, 
    ErrorMessage 
} from 'formik';
import {
    FormFieldName
} from '../BOTComponent/styleComponent'

const FormikFormGroup = ({
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
    let style = {
        container: {
            display: display ? null : 'none',
        },
        error: {
            color: "#dc3545"
        },
        example: {
            color: 'grey'
        },
    }

    return (
        <div 
            className={`form-group ${className}`}
            style={style.container}
        >
            <FormFieldName>
                {label}
            </FormFieldName>
            {component 
                ?   component()
                :   (
                        value ?
                            <Field  
                                name={name} 
                                type={type} 
                                value={value}
                                className={'form-control' + (error && touched ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                                style={{
                                    letterSpacing: 1,
                                }}
                            />
                        :
                        <div>
                            <Field  
                                name={name} 
                                type={type} 
                                className={'form-control' + (error && touched ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                                style={{
                                    letterSpacing: 1,
                                }}
                            />
                        </div>
                    )
            }
            {error && touched && 
                <small 
                    className="form-text text-capitalize"
                    style={style.error}
                >
                    {error}
                </small>
            }
            {example && !error && !touched &&
                <small 
                    className="form-text text-capitaliz"
                    style={style.example}
                >
                    {example}
                </small>
            }
        </div>
    );
};

export default FormikFormGroup;