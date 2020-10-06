import React from 'react'
import config from '../../config'
import axios from 'axios'
import dataSrc from '../../dataSrc'
import Cookies from 'js-cookie'
import { Nav, Button, Container, Row, Col } from 'react-bootstrap'

class GridButton extends React.Component {
    constructor() {
        super()
        this.state = {
            /** Retrieve the object type from config */
            objectType: config.surveillanceMap.objectType,

            /** Store the remianed pin colors that are usable for next pin color object representation */
            pinColorArray: config.surveillanceMap.iconColor.pinColorArray,

            /** Record the searched object type and the corresponding representation pin color */
            colorPanel: {},

            searchKeys: [],

            selectAll: false,

            refreshSearchResult: config.systemAdmin.refreshSearchResult,
        }
        this.processObjectTypeSet = this.processObjectTypeSet.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.processObjectTypeSet()
    }

    processObjectTypeSet() {
        /** Get the item name of the GridButton from searchableObjectData */
        // const searchableObjectData = this.props.searchableObjectData;
        // const objectType = new Set();
        // Object.values(searchableObjectData).map(item => {
        //     objectType.add(item.type)
        // })

        /** Get the item name of the GridButton from the state */
        const objectType = Array.from(config.surveillanceMap.objectType)
        objectType.push('All')

        this.setState({
            objectType,
        })
    }

    handleClick(e) {
        const searchKey = e.target.innerText

        const { clearColorPanel } = this.props
        let pinColor = ''
        let pinColorArray = clearColorPanel
            ? config.surveillanceMap.iconColor.pinColorArray.slice()
            : this.state.pinColorArray.slice()
        let colorPanel = clearColorPanel ? {} : this.state.colorPanel
        let objectType = this.state.objectType
        let selectAll
        if (this.props.clearColorPanel) {
            selectAll = true
        } else {
            selectAll = this.state.selectAll ? false : true
        }

        if (searchKey.toLowerCase() == 'all') {
            if (selectAll) {
                let childrenNodesArray = Array.from(
                    document.getElementsByClassName('gridbutton')
                ).filter((item) => item.textContent !== 'All')

                Array.from(objectType)
                    .filter((item) => item !== 'All')
                    .map((item) => {
                        if (colorPanel[item]) return
                        let color = pinColorArray.pop()
                        colorPanel[item] = color
                        childrenNodesArray.map((node) => {
                            if (item === node.textContent) {
                                node.style.background = color
                            }
                        })
                    })
                e.target.style.background = 'rgba(143, 143, 143, 0.5)'
            } else {
                Array.from(document.getElementsByClassName('gridbutton')).map(
                    (node) => {
                        node.style.background = ''
                    }
                )
                colorPanel = {}
                pinColorArray = config.surveillanceMap.iconColor.pinColorArray
            }
            this.setState({
                selectAll,
            })
        } else {
            if (e.target.style.background !== '') {
                pinColorArray.push(e.target.style.background)
                e.target.style.background = ''
                delete colorPanel[searchKey]
            } else {
                pinColor = e.target.style.background = pinColorArray.pop()
                colorPanel[searchKey] = pinColor
            }
        }

        const searchKeys = Object.keys(colorPanel)
        // this.putSearchHistory(searchKey)

        // if (Cookies.get('userInfo')){
        //     this.putSearchHistory(searchKey)
        // }

        this.setState({
            colorPanel,
            pinColorArray,
            searchKeys,
        })

        this.props.getSearchKey(searchKeys, colorPanel)
    }

    putSearchHistory(searchKey) {
        // const searchHistory = JSON.parse(Cookies.get('searchHistory'))
        // let flag = false;
        // const toPutSearchHistory = searchHistory.map( item => {
        //     if (item.name === searchKey) {
        //         item.value = item.value + 1;
        //         flag = true;
        //     }
        //     return item
        // })
        // flag === false ? toPutSearchHistory.push({name: searchKey, value: 1}) : null;
        // const sortedSearchHistory = this.sortSearchHistory(toPutSearchHistory)
        // Cookies.set('searchHistory', JSON.stringify(sortedSearchHistory))
        // this.checkInSearchHistory()
    }

    checkInSearchHistory() {
        let username = 'joechou'
        axios
            .post(dataSrc.addUserSearchHistory, {
                username,
                history: JSON.stringify(searchHistory),
            })
            .then((res) => {})
            .catch((error) => {
                console.log(error)
            })
    }

    /** Sort the user search history and limit the history number */
    sortSearchHistory(history) {
        let toReturn = history.sort((a, b) => {
            return b.value - a.value
        })
        return toReturn
    }

    render() {
        const { objectType } = this.state

        const style = {
            row: {
                // width: 500,
            },
        }
        return (
            // <div>
            //     {objectType.length !== 0
            //         ?
            //             <Row className='' style={style.row}>
            //                 {Array.from(objectType).map( (item,index) => {
            //                     return (
            //                         <Col sm={6} md={6} lg={6} xl={6} className='px-1' key={index}>
            //                             <div className='gridbutton' onClick={this.handleClick} key={index} name={item.toLowerCase()}>
            //                                 {item}
            //                             </div>
            //                         </Col>
            //                     )
            //                 })}
            //             </Row>
            //         : null
            //     }
            // </div>
            <div>
                {objectType.length !== 0 ? (
                    <Row className="" style={style.row}>
                        {Array.from(objectType).map((item, index) => {
                            return (
                                <Nav.Item className="">
                                    <div
                                        className="gridbutton mr-2"
                                        onClick={this.handleClick}
                                        key={index}
                                        name={item.toLowerCase()}
                                    >
                                        {item}
                                    </div>
                                </Nav.Item>
                            )
                        })}
                    </Row>
                ) : null}
            </div>
        )
    }
}

export default GridButton
