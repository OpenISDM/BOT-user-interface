import React from 'react';
import ReactLoading from "react-loading"; 
import {
    LoaderWrapper 
} from '../BOTComponent/styleComponent'
import styleSheet from '../../config/styleSheet'

const Loader = () => {
    return ( 
        <LoaderWrapper>
            <ReactLoading type={"bubbles"} color={styleSheet.theme}  /> 
        </LoaderWrapper>
    ) 
}

export default Loader