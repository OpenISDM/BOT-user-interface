/*
    2020 © Copyright (c) BiDaE Technology Inc. 
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.
  
    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ShiftChangeRecord.js

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


import React, {Fragment} from 'react';
import { 
    ButtonToolbar
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import dataSrc from "../../../dataSrc"
import selecTableHOC from 'react-table/lib/hoc/selectTable';
const SelectTable = selecTableHOC(ReactTable);
import { shiftChangeRecordTableColumn } from '../../../config/tables'
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
import { AppContext } from '../../../context/AppContext';
import styleConfig from '../../../config/styleConfig';
import AccessControl from '../../authentication/AccessControl'
import {
    PrimaryButton 
} from '../../BOTComponent/styleComponent'
import apiHelper from '../../../helper/apiHelper';
import config from '../../../config';
import { JSONClone } from '../../../helper/utilities';
import ShiftChange from '../ShiftChange';
import Select from 'react-select';
import Cookies from 'js-cookie';


class ShiftChangeRecord extends React.Component{

    static contextType = AppContext

    state = {
        data: [],
        columns: [],
        deviceGroupListOptions: [],
        devicelist: Cookies.get('user') && JSON.parse(Cookies.get('user')).myDevice ? JSON.parse(Cookies.get('user')).myDevice : null,
        showForm: false,
        showShiftChange: false,
        locale: this.context.locale.abbr,
        selectAll: false,
        selection: [],
        showDeleteConfirmation: false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getData()
        }
    }

    componentDidMount = () => {
        this.getData();
        this.getDeviceGroup();
    }

    getData(){
        let {
            locale
        } = this.context
        
        apiHelper.record.getRecord(
            config.RECORD_TYPE.SHIFT_CHANGE,
            locale.abbr
        )
        .then(res => {
            let columns = JSONClone(shiftChangeRecordTableColumn);
            
            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.rows.map(item => {
                item.shift = item.shift && locale.texts[item.shift.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                data: res.data.rows,
                columns,
                locale: locale.abbr
            })
        })
        .catch(err => {
            console.log(`get shift change record failed ${err}`)
        })
    }

    toggleAll = () => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            currentRecords.forEach(item => {
                if (item._original) {
                selection.push(item._original.id);
                }
            });
        }
      
       
        this.setState({ selectAll, selection });
    };

    toggleSelection = (key, shift, row) => {
       
        if(key != 999){  //多的
        let selection = [...this.state.selection];
        const selectThis = this.state.selectThis ? false : true;

        key = typeof key === 'number' ? key : parseInt(key.split('-')[1])
        const keyIndex = selection.indexOf(key.toString());
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex+1)
            ];
            
        } else {
         
            selection.push(key.toString());
        }
 
        this.setState({ selectThis, selection });
        }

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    }

    deleteRecord = () => {


        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;

        this.state.data.map (item => {
    
            this.state.selection.map(itemSelect => {
                itemSelect === item.id 
                ? 
    
                 deleteArray.push(deleteCount.toString())
                : 
                null          
            })
                 deleteCount +=1
        })

        deleteArray.map( item => {
        this.state.data[item] === undefined ?
              null
            :
            idPackage.push(parseInt(this.state.data[item].id))
        })

        axios.post(dataSrc.deleteShiftChangeRecord, {
            idPackage
        })
        .then(res => {
            this.getData()
            this.setState({
                selection: [],
                selectAll: false,
                showDeleteConfirmation: false
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleCloseDeleteConfirmForm = () => {
        this.setState({
            showDeleteConfirmation: false,
        })
    }

    handleSubmitDeleteConfirmForm = (pack) => {
        this.deleteRecord()
    }

    handleClose = () => {
        this.setState({
            showShiftChange: false
        })
    }

    handleClick = (e) => {

        let name = e.target.getAttribute('name')
        
        switch(name) {
            case SHIFT_CHANGE:
                e.preventDefault()
                this.setState({
                    showShiftChange: true
                })
                break;
        }
    }

    getDeviceGroup = () => {
        apiHelper.deviceGroupListApis.getDeviceGroupList()
            .then(res => {
                const data = res.data.map(group => {
                    return {
                        ...group,
                        devices: group.devices || []
                    }
                })
                let deviceGroupListOptions = res.data.map(item => {
                    return {
                        label: item.name,
                        value: item
                    }
                })

                const updatedSelectedDeviceGroup = this.state.selectedDeviceGroup 
                    ? data.filter(group => {
                        return group.id == this.state.selectedDeviceGroup.id 
                    })[0]
                    : null

                this.setState({
                    deviceGroupListOptions,
                    selectedDeviceGroup: updatedSelectedDeviceGroup,
                })
            })
            .catch(err => {
                console.log('err when get device group ', err)
            })
    }

    selectDeviceGroup = devicelist => {
        let callback = () => {
            let user = {
                ...JSON.parse(Cookies.get('user')),
                myDevice: devicelist
            }
            Cookies.set('user', user)
        }
        this.setState({
            devicelist,
        }, callback)
    }

    render(){
        const {
            locale
         } = this.context

        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const { 
            selectAll, 
            selectType,
            devicelist 
        } = this.state;


        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        return (
            <Fragment>
                <div className="d-flex justify-content-end">
                    <Select
                        className="flex-grow-1"
                        isClearable
                        onChange={this.selectDeviceGroup}
                        options={this.state.deviceGroupListOptions}
                        value={this.state.devicelist}
                    />
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >     
                        <ButtonToolbar>       
                            <PrimaryButton
                                disabled={!devicelist}
                                onClick={() => {
                                    this.setState({
                                        showShiftChange: true
                                    })
                                }}    
                            >
                                {locale.texts.GENERATE_RECORD}
                            </PrimaryButton>             
                            <PrimaryButton
                                disabled={this.state.selection.length == 0}
                                onClick={() => {
                                    this.setState({
                                        showDeleteConfirmation: true
                                    })
                                }}    
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                <SelectTable
                    keyField='id'
                    data={this.state.data}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)}
                    className='-highlight text-none'
                    onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    onSortedChange={(e) => {this.setState({selectAll:false,selection:''})}}
                    style={{maxHeight:'75vh'}}                             
                    {...extraProps}
                    {...styleConfig.reactTable}
                    NoDataComponent={() => null}
                    getTrProps={(state, rowInfo, column, instance) => {
                        
                        return {
                            onClick: (e, handleOriginal) => {
                                let id = rowInfo.index+1
                                this.toggleSelection(id)
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                                apiHelper.fileApiAgent.getFile(rowInfo.original.file_path)
                            }
                        }
                    }}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleCloseDeleteConfirmForm}
                    handleSubmit={this.handleSubmitDeleteConfirmForm}
                />
                <ShiftChange 
                    show={this.state.showShiftChange}
                    handleClose={this.handleClose}
                    devicelist={devicelist}
                />
            </Fragment>
        )
    }
}

export default ShiftChangeRecord