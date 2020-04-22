import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import FrequentSearch from '../../container/FrequentSearch';
import ObjectTypeList from '../../container/ObjectTypeList';
import config from '../../../config';
import BOTSearchbar from '../../presentational/BOTSearchbar';

const BrowserSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
}) => {
    return (
        <div 
            id='searchContainer' 
            className="py-1" 
            onTouchMove={handleTouchMove}
        >
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <BOTSearchbar
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                />
            </Row>
        </div>
    )
}

export default BrowserSearchContainer