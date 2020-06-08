/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        TableSearchResultList.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/


import React, { Fragment } from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import AccessControl from '../../presentational/AccessControl';
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import LocaleContext from '../../../context/LocaleContext';
import {
    ListTitle
} from '../../BOTComponent/styleComponent';

const SearchResult = ({
    searchKey,
    searchResult,
    title,
    selection,
    handleToggleNotFound,
    showNotFoundResult,
    onSelect
}) => {

    let locale = React.useContext(LocaleContext)

    const style = {
        noResultDiv: {
            color: 'grey',
            fontSize: '1rem',
        },
        searchResultListForTablet: {
            dispaly: searchKey ? null : 'none',
            maxHeight: '28vh'
        }
    }
    

    return(
        <Fragment>
            <Row className='d-flex justify-content-center'>
                <ListTitle>
                    {title}
                </ListTitle>
            </Row>
            <Row>
                {searchResult.length === 0 
                    ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                            {locale.texts.NO_RESULT}
                        </Col> 
                    :   
                        <Col className="searchResultListGroupForTablet d-flex justify-content-center">
                            <ScrollArea 
                                style={style.searchResultListForTablet} 
                                smoothScrolling={true}
                            >                 
                                <AccessControl
                                    permission={'form:edit'}
                                    renderNoAccess={() => (
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            selection={selection}
                                        />
                                    )}
                                >
                                    <SearchResultListGroup 
                                        data={searchResult}
                                        onSelect={onSelect}
                                        selection={selection}
                                    />

                                </AccessControl>
                            </ScrollArea>
                        </Col>
                }
            </Row>
            <Row className='d-flex justify-content-center mt-3'>
                <Button
                    variant="link"
                    onClick={handleToggleNotFound}
                    size="lg"
                    disabled={false}
                >
                    {showNotFoundResult
                        ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                        : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                    }

                </Button>
            </Row>
        </Fragment>
    )
}



export default SearchResult
