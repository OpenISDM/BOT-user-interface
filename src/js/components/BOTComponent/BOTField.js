import React, { Fragment } from 'react';
import styleSheet from '../../config/styleSheet';
import {
    Field
} from 'formik'

const BOTField = ({
    name,
    iconName,
    error,
    touched,
    placeholder,
    label,
    example,
    className,
    boxWidth
}) => {
    return ( 
        <div
            className={className}
            style={{
                position: 'relative'
            }}
        >
            {iconName &&
                <i
                    className={iconName}
                    aria-hidden="true"
                    style={{ 
                        position: "absolute", 
                        left: 10,
                        top: 16,
                        color: styleSheet.iconColor
                    }}
                />   
            }
            <Field
                type="text"
                name={name}
                error={error}
                touched={touched}
                className={'form-control'} 
                placeholder={placeholder}
                label={label}
                style={{
                    width: boxWidth,
                    height: '3rem',
                    borderRadius: 0,
                    paddingLeft:35                                                       
                        
                }}
            />
            {error && (
                <div 
                    className=""
                    style={{
                        fontSize: '0.6rem',
                        color: styleSheet.warning,
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    {error}
                </div>
            )}
            <div 
                className=""
                style={{
                    fontSize: '0.6rem',
                    color: styleSheet.grey,
                    position: 'absolute',
                    right: 0,
                }}
            >
                {example}
            </div>
        </div>
    )
}

export default BOTField