/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        PatientTable.js

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
    ButtonToolbar,
    Row,
    Col
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../config/styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import BindForm from '../container/BindForm';
import DissociationForm from '../container/DissociationForm';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm';
import Select from 'react-select';
import BOTInput from '../presentational/BOTInput';
import axios from 'axios';
import EditPatientForm from '../container/EditPatientForm';
import {
    PrimaryButton
} from '../BOTComponent/styleComponent';
import messageGenerator from '../../helper/messageGenerator';
const SelectTable = selecTableHOC(ReactTable);
import AccessControl from '../authentication/AccessControl';
import { patientTableColumn } from '../../config/tables';
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import config from '../../config';
import dataSrc from '../../dataSrc';
import apiHelper from '../../helper/apiHelper';


class PatientTable extends React.Component{
    
    static contextType = AppContext
    
    state = {
        isShowBind:false,
        isPatientShowEdit:false,
        showDeleteConfirmation:false,
        selectedRowData:'',
        selectAll: false,
        selection: [],
        formPath:'',
        formTitle:'',
        disableASN: false,
        done:false,
        data: [],
        columns: [],
        areaTable: [],
        physicianList: [],
        roomOptions: [],
        objectFilter: [],
        objectTable: [], 
        filteredData: [],
        filterSelection: {},
        locale: this.context.locale.abbr
    }

    componentDidMount = () => {
        this.getData();
        this.getAreaTable();
        // this.getLbeaconData();
        this.getPhysicianList();
        // this.getImportData();
    }

    getData = (callback) => {
        let { 
            locale,
            auth
        } = this.context

        apiHelper.objectApiAgent.getObjectTable({
            locale: locale.abbr,
            areas_id: auth.user.areas_id,
            objectType: [0, 1, 2]
        })
        .then(res => {
            let columns = _.cloneDeep(patientTableColumn)
            let data = [] 
            let typeList = {} 

            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            res.data.rows
            .filter(item => item.object_type != 0)
            .map(item => {

                item.monitor_type = this.getMonitorTypeArray(item, 'patient').join('/')
                item.object_type = locale.texts.genderSelect[item.object_type]
                
                item.area_name = {
                    value: item.area_name,
                    label: locale.texts[item.area_name],
                    id: item.area_id
                }
                data.push(item)
            }) 

            this.setState({
                data,
                isShowEdit: false,
                isShowBind: false,
                showDeleteConfirmation: false,
                isPatientShowEdit: false,
                disableASN: false,
                filteredData: data,
                columns,
                objectTable: res.data.rows,
                locale: locale.abbr
            }, callback)
        })
        .catch(err => {
            console.log(err);
        })
    }

    // getImportData = () => {
    //     let { locale } = this.context
    //     axios.post(getImportPatient, {
    //         locale: locale.abbr
    //     })
    //     .then(res => {
    //         this.setState({
    //             importData: res.data.rows,
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    
    // }

    getAreaTable = () => {
        let {
            locale
        } = this.context
        retrieveDataHelper.getAreaTable()
            .then(res => {
                let areaSelection = res.data.rows.map(area => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name]
                    }
                })
                this.setState({
                    areaTable: res.data.rows,
                    areaSelection,
                    filterSelection: {
                        ...this.state.filterSelection,
                        areaSelection,
                    }
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    getMonitorTypeArray = (item, type) => {
        return Object.keys(config.monitorType)
            .reduce((checkboxGroup, index) => {
                if (item.monitor_type & index) {
                    checkboxGroup.push(config.monitorType[index])
                }
                return checkboxGroup
            }, [])
    }

    getLbeaconData = () => {
        let { locale } = this.context
        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res => {
            let roomOptions = []
            res.data.rows.map(item => {
                if (item.room) {
                    roomOptions.push({
                        value: item.id,
                        label: item.room
                    })
                }
            })  
            this.setState({
                roomOptions,
            })
        })
        .catch(err => {
            console.log("get lbeacon data fail : " + err);
        })
    }

    getPhysicianList = () => {
        let { locale } = this.context
        axios.get(dataSrc.user, {
            locale: locale.abbr 
        })
        .then(res => {
            let physicianList = res.data.rows
                .filter(user => {
                    return user.role_type.includes("care_provider")
                })

            this.setState({
                physicianList
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleClose = () => {
        this.setState({
            isShowBind:false,
            isPatientShowEdit:false,
            showDeleteConfirmation:false,
            selectedRowData:'',
            disableASN:false,
        })
    }

    handleClick = (e) => {
        this.setState({
            disableASN: false,
            isPatientShowEdit: true,
            formTitle: 'add persona',
            apiMethod: 'post',
            selectedRowData:'',
        })
    }

    handleSubmitForm = (formOption, cb) => {
        let {
            apiMethod
        } = this.state

        axios[apiMethod](dataSrc.object, {
            formOption,
            mode: 'PERSONA',
        }).then(res => { 
            let callback = () => {
                messageGenerator.setSuccessMessage(
                    'save success'
                )
            }
            this.getData(callback)
        }).catch( error => {
            console.log(error)
        })
    }

    toggleSelection = (key, shift, row) => {
         
        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ 
            selection 
        });
    };

    toggleAll = () => {
      
        const selectAll = this.state.selectAll ? false : true;
        let selection = [];
        let rowsCount = 0 ; 
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
           // const currentRecords = wrappedInstance.props.data
 
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
           
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item._original.id)
                } 
            });
 
        }else{
            selection = [];
        }
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };


    handleClickButton = (e) => {

        let { name } = e.target
        switch(name) {
            case 'associate':
                this.setState({
                    isShowBind: true,
                    bindCase: 2,
                    apiMethod: 'post',
                })
            break;
            case 'delete':
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect : 0,
                })
            break;
        }

    }

    objectMultipleDelete = () => {
        let formOption = []
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
        this.setState({selectAll:false})
        deleteArray.map( item => {
         
            this.state.data[item] === undefined ?
                null
                :
                formOption.push(this.state.data[item].mac_address)
            })

        axios.delete(dataSrc.object, {
            data: {
                formOption
            }
        })
        .then(res => {
            let callback = () => {
                messageGenerator.setSuccessMessage(
                    'save success'
                )
            }
            this.getData(callback)
        })
        .catch(err => {
            console.log(err)
        })
    }


    filterData = (data, key, filteredAttribute) => {
        const { locale } = this.context  
        key = key.toLowerCase()
        let filteredData = data.filter(obj => { 
            if(filteredAttribute.includes('name')){

                let keyRex = new RegExp(key)
                if(obj.name.toLowerCase().match(keyRex)){
                    return true
                }
            }
            if(filteredAttribute.includes('type')){

                let keyRex = new RegExp(key)
                
                if(obj.type.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if(filteredAttribute.includes('acn')){
                let keyRex = new RegExp(key)
                if(obj.asset_control_number.toLowerCase().match(keyRex)) return true

            }

            if  (filteredAttribute.includes('status')){
                
                let keyRex = new RegExp(key.toLowerCase())

                if(obj.status.label.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if (filteredAttribute.includes('area')){ 
                let keyRex = new RegExp(key) 
                if (obj.area_name.label != undefined){
                    if (obj.area_name.label.match(keyRex)) {
                       return true 
                    }
                } 
            }

            if (filteredAttribute.includes('monitor')){
                let keyRex = new RegExp(key)
                if(obj.monitor_type.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if  (filteredAttribute.includes('macAddress')){

                let keyRex = key.replace(/:/g, '')
                if (obj.mac_address.replace(/:/g, '').toLowerCase().match(keyRex)) return true
            }

            if(filteredAttribute.includes('sex')){
               
                if (obj.object_type == key){
                    return true
                }
            }
 
            if(filteredAttribute.includes('physician_name')){
              
                let keyRex = new RegExp(key)

                if (obj.physician_name && obj.physician_name.toLowerCase().match(keyRex)){
                    return true
                } 
            }

            return false
        })
        this.setState({ loadingFlag:  false })
        return filteredData
        
    }

    addObjectFilter = (key, attribute, source) => {

        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        
        this.state.objectFilter.push({
            key, attribute, source
        })
        this.filterObjects()
    }

    removeObjectFilter = (source) => {
        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        this.filterObjects()
    }

    filterObjects = () => {
        let filteredData = this.state.objectFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.data)

        this.setState({
            filteredData
        })
    }

    addPatientFilter = (key, attribute, source) => {
        this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
        this.state.patientFilter.push({
            key, attribute, source
        }) 
       
        this.filterPatients()
    }

    removePatientFilter = (source) => {
        this.state.patientFilter = this.state.patientFilter.filter(filter => source != filter.source)
        this.filterPatients()
    }

    filterPatients = () => {
        let filteredPatient = this.state.patientFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.dataPatient)
        this.setState({
            filteredPatient
        }) 
    }

    render(){

        const { locale } = this.context 

        const {  
            selectedRowData,
            selectAll,
            selectType,
        } = this.state

        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        return(
            <Fragment> 
                <div className="d-flex justify-content-between">
                    <Row noGutters> 
                        <Col>
                            <BOTInput
                                className={'float-right'}
                                placeholder={locale.texts.SEARCH}
                                getSearchKey={(key) => {
                                    this.addObjectFilter(
                                        key, 
                                        ['name', 'area', 'macAddress', 'acn', 'monitor', 'physician_name'], 
                                        'search bar'
                                    )
                                }}
                                clearSearchResult={null}                                        
                            />
                        </Col>
                        <AccessControl
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Col>
                                <Select
                                    name="Select Area Patient"
                                    className='float-right w-100'
                                    styles={styleConfig.reactSelect}
                                    onChange={(value) => {
                                        if(value){
                                            this.addObjectFilter(value.label, ['area'], 'area select')
                                        }else{
                                            this.removeObjectFilter('area select')
                                        }
                                    }}
                                    options={this.state.filterSelection.areaSelection}
                                    isClearable={true}
                                    isSearchable={false}
                                    placeholder={locale.texts.SELECT_AREA}
                                    styles={styleConfig.reactSelectSearch}
                                />
                            </Col> 
                            <Col>
                                <Select
                                    name="Select Status"
                                    className='float-right w-100'
                                    styles={styleConfig.reactSelect}
                                    onChange={(value) => {
                                        if(value){
                                            this.addObjectFilter(value.label, ['monitor'], 'monitor select')
                                        }else{
                                            this.removeObjectFilter('monitor select')
                                        }
                                    }}
                                    options={this.state.filterSelection.monitorTypeOptions}
                                    isClearable={true}
                                    isSearchable={false}
                                    placeholder={locale.texts.SELECT_MONITOR_TYPE}
                                    styles={styleConfig.reactSelectSearch}
                                />
                            </Col>
                        </AccessControl>
                    </Row>
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                name='associate'
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ASSOCIATE}
                            </PrimaryButton>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                onClick={this.handleClick}
                            >
                                {locale.texts.ADD}
                            </PrimaryButton>
                            <PrimaryButton
                                className='text-capitalize mr-2 mb-1'
                                name='delete'
                                onClick={this.handleClickButton}
                                disabled={this.state.selection.length == 0}
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                <SelectTable
                    keyField='id'
                    data={this.state.filteredData}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)}
                    className='-highlight text-none'
                    style={{maxHeight:'75vh'}} 
                     onSortedChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    {...extraProps}
                    {...styleConfig.reactTable}
                    pageSize={this.state.filteredData.length}

                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => { 
                                if (!e.target.type) { 
                                    this.setState({
                                        isPatientShowEdit:true,
                                        selectedRowData: this.state.data[rowInfo.index],
                                        formTitle: 'edit info',
                                        disableASN: true,
                                        apiMethod: 'put',
                                    })
                                } 
                            },
                        }
                    }} 
                />
                <EditPatientForm
                    show = {this.state.isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedRowData={selectedRowData  || ''} 
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    objectTable= {this.state.objectTable}
                    physicianList={this.state.physicianList}
                    roomOptions={this.state.roomOptions}
                    disableASN = {this.state.disableASN}
                    areaTable={this.state.areaTable}
                />  
                <BindForm
                    show = {this.state.isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable} 
                    areaTable={this.state.areaTable} 
                />
                <DissociationForm
                    show={this.state.isShowEditImportTable} 
                    title={this.state.formTitle} 
                    selectedRowData={this.state.selectedRowData || 'handleAllDelete'} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    objectTable={this.state.objectTable}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                        }, {})
                    }
                    refreshData={this.state.refreshData}  
                />

                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={
             
                    this.state.warningSelect == 0 ?  this.objectMultipleDelete :null
              
                    }
                />
            </Fragment>
        )
    }
}
export default PatientTable
