import BOTCheckbox from '../components/presentational/BOTCheckbox';
import BOTPagination from '../components/presentational/BOTPagination';
import Select, {components} from 'react-select';
import React from 'react';
import styleSheet from './styleSheet';

const ValueContainer = ({ children, ...props }) => {
    return (
        components.ValueContainer && (
            <components.ValueContainer {...props}>
            {!!children && (
                <i
                    className="fa fa-search"
                    aria-hidden="true"
                    style={{ 
                        position: "absolute", 
                        left: 10,
                        color: styleSheet.iconColor
                    }}
                />
            )}
            {children}
            </components.ValueContainer>
        )
    );
};

const styleConfig = {
    reactSelect: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '1rem',
        }),
        valueContainer: (provided) => ({
            ...provided,
            position: 'static',
            color: 'red'
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: 40
        }),
        menu: (provided) => ({
            ...provided,
            padding: 0
        }),
        control: (provided) => ({
            ...provided,
            fontSize: '1rem',
            minHeight: '2.5rem',
            height:  'calc(2rem + 2px)',
            position: 'none',
            // width: '250px',
            // borderRadius: 0

        }),
        singleValue: (provided) => ({
            ...provided,

            // maxWidth: 'calc(90% - 8px)'
        }),
    },
    reactSelectSearch : {
        control: (provided) => ({
            ...provided,
            fontSize: '1rem',
            minHeight: '3rem',
            position: 'none',
            width: '550px',
            borderRadius: 0                                
        }),

        valueContainer: base => ({
            ...base,
            paddingLeft: 35
        }),
    },

    reactSelectFilter: {
        control: (provided) => ({
            ...provided,
            fontSize: '1rem',
            minHeight: '3rem',
            position: 'none',
            width: '300px',
            borderRadius: 0,
        }),

        // valueContainer: base => ({
        //     ...base,
        //     paddingLeft: 35
        // }),
    },

    reactSelectSearchComponent : {
        IndicatorSeparator: () => null,
        DropdownIndicator:() => null,
        ValueContainer
    },

    reactSelectNavbar: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
        }),
        
        control: (provided) => ({
            ...provided,
            border: 'none',
            width: 200,
        }),
        
        singleValue: (provided, state) => ({
            opacity: state.isDisabled ? 0.5 : 1,
            transition: 'opacity 300ms',
            cursor: 'pointer',
        }),
    },
    reactTable: {

        getTdProps: () => {
            return {
                style: {
                    borderRight: 'none',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    minHeight: '3rem',
                    height: '3rem'
                }
            }
        },

        getTheadThProps: () => {
            return {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: 'none',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    minHeight: '2.5rem',
                    fontWeight: 500,
                    color: 'black',
                    // backgroundColor: '#80808014',
                    // boxShadow: 'rgba(32, 33, 36, 0.28) 0px 0px 0px 0px',
                    
                }
            }
        },
        getProps: () => {
            return {
                style: {
                    border: 'none',
                    // borderTop: '1px solid #cec7c7',
                }
            }
        },

        getTheadProps: () => {
            return {
                style: {
                    boxShadow: 'rgba(32, 33, 36, 0.28) 0px 0px 0px 0px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    // height: '1rem'
                    textTransform: 'capitalize',
                }
            }
        },

        getTableProps: () => {
            return {
                style: {
                    padding: '10px 20px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    // borderRadius: '5px',
                    background: 'white'
                }
            }
        },


        SelectAllInputComponent: BOTCheckbox,

        SelectInputComponent: BOTCheckbox,

        PaginationComponent: BOTPagination,

        showPaginationTop: true,

        showPaginationBottom: false,

        showPagination: true,

        previousText: <i class="fas fa-chevron-left"></i>,

        nextText: <i class="fas fa-chevron-right"></i>,

    },
    checkbox: {
        fontSize: '0.9rem'
    },
    radioButton: {
        fontSize: '0.9rem'
    },
    link: {
        color: '#1890ff'
    },
}

export default styleConfig