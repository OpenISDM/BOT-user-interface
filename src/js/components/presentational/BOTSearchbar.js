/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTSearchbar.js

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

import React from 'react'
import { Form, Button } from 'react-bootstrap'
import Autosuggest from 'react-autosuggest'
import config from '../../config'
import { SEARCH_BAR, SEARCH_HISTORY } from '../../config/wordMap'
import apiHelper from '../../helper/apiHelper'
import { AppContext } from '../../context/AppContext'

let suggestData = []
let load_suggest = false

const getSuggestionValue = (suggestion) => suggestion

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion || null}</div>

const renderInputComponent = (inputProps) => (
    <div className="inputContainer">
        <i className="fas fa-search icon font-size-120-percent" />
        <input {...inputProps} />
    </div>
)

const suggestionFilter = {
    autoComplete: (suggestData, inputValue, inputLength) => {
        return suggestData.filter((term) => {
            return term.toLowerCase().slice(0, inputLength) === inputValue
        })
    },

    partialMatch: (suggestData, inputValue, inputLength) => {
        return suggestData.filter((term) => {
            return term.toLowerCase().indexOf(inputValue) > -1
        })
    },
}

class BOTSearchbar extends React.Component {
    static contextType = AppContext

    state = {
        value: '',
        suggestions: [],
    }

    componentDidUpdate = (prepProps) => {
        if (
            prepProps.clearSearchResult !== this.props.clearSearchResult &&
            !prepProps.clearSearchResult
        ) {
            this.setState({
                value: '',
            })
        }
        if (!load_suggest) {
            suggestData = this.props.keywords
            load_suggest = true
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        let type
        let searchKey = {}
        let value = this.state.value

        if (this.props.suggestData.includes(value)) {
            type = SEARCH_HISTORY
            searchKey = {
                type,
                value,
            }
            this.addSearchHistory(searchKey)
        } else {
            type = SEARCH_BAR
            searchKey = {
                type,
                value,
            }
        }

        this.props.getSearchKey(searchKey)

        this.checkInSearchHistory(value)
    }

    /** Set search history to auth */
    addSearchHistory = (searchKey) => {
        let { auth } = this.context

        if (!auth.authenticated) return

        if (!this.props.suggestData.includes(searchKey.value)) return

        let searchHistory = [...auth.user.searchHistory] || []

        const itemIndex = searchHistory.indexOf(searchKey.value)

        if (itemIndex > -1) {
            searchHistory = [
                ...searchHistory.slice(0, itemIndex),
                ...searchHistory.slice(itemIndex + 1),
            ]
        }

        searchHistory.unshift(searchKey.value)

        auth.setSearchHistory(searchHistory)

        this.checkInSearchHistory(searchKey.value)
    }

    /** Insert search history to database */
    checkInSearchHistory = (itemName) => {
        let { auth } = this.context

        apiHelper.userApiAgent
            .addSearchHistory({
                username: auth.user.name,
                keyType: 'object type search',
                keyWord: itemName,
            })
            .then((res) => {
                this.setState({
                    searchKey: itemName,
                })
            })
            .catch((err) => {
                console.log(`check in search history failed ${err}`)
            })
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        })
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        /** limit count by specific number */
        let suggestTemp = []

        suggestTemp = suggestionFilter.partialMatch(
            this.props.suggestData,
            inputValue,
            inputLength
        )

        let suggestLimit = []

        suggestTemp.map((item, index) => {
            index < config.AUTOSUGGEST_NUMBER_LIMIT
                ? suggestLimit.push(item)
                : null
        })

        return inputLength === 0 ? [] : suggestLimit
    }

    render() {
        const { value, suggestions } = this.state

        const inputProps = {
            placeholder: '',
            value,
            onChange: this.onChange,
        }

        return (
            <Form className="d-flex justify-content-around">
                <Form.Group
                    className="d-flex justify-content-center mb-0 mx-1"
                    // style={{
                    //     minWidth: parseInt(this.props.width) * 0.9
                    // }}
                >
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={
                            this.onSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                            this.onSuggestionsClearRequested
                        }
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        renderInputComponent={renderInputComponent}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="link"
                    className="btn btn-link btn-sm bd-highlight width-0"
                    onClick={this.handleSubmit}
                ></Button>
            </Form>
        )
    }
}

export default BOTSearchbar
