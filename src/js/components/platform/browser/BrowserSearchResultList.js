import React, {Fragment} from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import AccessControl from '../../presentational/AccessControl';
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import LocaleContext from '../../../context/LocaleContext';

const BrowserSearchResultList = ({
    searchResult,
    title,
    selection,
    handleToggleNotFound,
    showNotFoundResult,
    onSelect
}) => {

    let locale = React.useContext(LocaleContext);

    const style = {
        noResultDiv: {
            color: 'grey',
            fontSize: '1rem',
        },
        titleText: {
            color: 'rgb(80, 80, 80, 0.9)',
        }, 
    }

    return (
        <Fragment>
            <Row className='d-flex justify-content-center' style={style.titleText}>
                <div className='title text-capitalize'>
                    {title}
                </div>
            </Row>
            <Row>
                {searchResult.length == 0 
                    ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                            <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                        </Col> 
                    :   
                        <Col className="searchResultListGroup d-flex justify-content-center">
                            <ScrollArea 
                                smoothScrolling={true}
                                horizontal={false}
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
                                        action
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

export default BrowserSearchResultList

