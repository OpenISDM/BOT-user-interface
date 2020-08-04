/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GatewayTable.js

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
import { ButtonToolbar } from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'; 
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import config from '../../config';
import dataSrc from '../../dataSrc';
import { 
    gatewayTableColumn
} from '../../config/tables';
import { AppContext } from '../../context/AppContext';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm' 
import BOTCheckbox from '../presentational/BOTCheckbox'
import styleConfig from '../../config/styleConfig'
import messageGenerator from '../../helper/messageGenerator'
const SelectTable = selecTableHOC(ReactTable);
import {
    PrimaryButton
} from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl';
import EditGatewayForm from '../presentational/form/EditGatewayForm';
import apiHelper from '../../helper/apiHelper';
import { JSONClone } from '../../helper/utilities';

class GatewayTable extends React.Component{
    
    static contextType = AppContext
    
    state = {  
        locale: this.context.locale.abbr,
        data: [],
        columns: [],
        showDeleteConfirmation:false,
        selectedRowData: '',
        showEdit: false,
        selection:[],
        selectAll :false,
        selectType:'',
        disable:true,
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.abbr !== prevState.locale) {
            this.getData();
        }
    }

    componentDidMount = () => {
        this.getData();
        this.getGatewayDataInterval = setInterval(this.getData, config.getGatewayDataIntervalTime);
    }

    componentWillUnmount = () => {
        clearInterval(this.getGatewayDataInterval);
    }

    getData = (callback) => {
        let { 
            locale
        } = this.context

        apiHelper.gatewayApiAgent.getGatewayTable({
            locale: locale.code
        })
        .then(res => {
            this.props.setMessage('clear')
            let column = JSONClone(gatewayTableColumn);
            column.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                data: res.data.rows,
                columns: column,
                locale: locale.abbr,
                selection: [],
                selectAll: false,
                showDeleteConfirmation: false,
                showEdit: false,
            }, callback)
        })
        .catch(err => {
            this.props.setMessage(
                'error', 
                'connect to database failed',
                true,
            )
            console.log(`get gateway data failed ${err}`);
        })
    }

    handleClose = () => {
        this.setState({ 
            showDeleteConfirmation: false,
            selectedRowData: '',
            showEdit: false,
            selection:[],
            selectAll :false,
            selectType:''
        })
    }  

    handleSubmitForm = (formOption) => {
        let callback = () => messageGenerator.setSuccessMessage(
            'save success'
        ) 
        axios.put(dataSrc.gateway, {
            formOption,
        }).then(res => {
            this.getData(callback) 
        }).catch(err => {
            console.log(`edit gateway failed ${err}`)
        })
    }

    toggleSelection = (key, shift, row) => { 
        let selection = [...this.state.selection];
        selection != '' ? this.setState({disable : true}) :  this.setState({disable : false}) 
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
        selection == '' ? this.setState({disable : true}) :  this.setState({disable : false}) 
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };
 

    deleteRecordGateway = () => {
        let idPackage = []
        var deleteArray = [];
        var deleteCount = 0;
        this.state.data.map (item => {
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ?   deleteArray.push(deleteCount.toString())
                :   null          
            })
                deleteCount +=1
        })
        this.setState({selectAll:false})
        deleteArray.map( item => {
            this.state.data[item] === undefined 
                ?   null
                :   idPackage.push(parseInt(this.state.data[item].id))
            }) 
            axios.delete(dataSrc.gateway, {
                data: {
                    idPackage
                }
            })
            .then(res => {
                let callback = () => messageGenerator.setSuccessMessage(
                    'save success'
                )
                this.getData(callback) 
            })
            .catch(err => {
                console.log(err)
            })
            this.setState({selection:[]})
    }


    render(){
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
       
        const { locale } = this.context 

        return(
            <Fragment>  
                <div className="d-flex justify-content-start">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >            
                        <ButtonToolbar>
                            <PrimaryButton
                                className='mb-1 text-capitalize mr-2'
                                onClick={() => {
                                    this.setState({
                                        deleteObjectType: 'gateway',
                                        showDeleteConfirmation: true
                                    })
                                }}
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
                    data={this.state.data} 
                    columns={this.state.columns}
                    {...styleConfig.reactTable}
                    ref={r => (this.selectTable = r)}
                    className='-highlight'
                    style={{maxHeight:'75vh'}}  
                    onSortedChange={(e) => {this.setState({selectAll:false,selection:''})}}                   
                    onPageChange={(e) => {
                        this.setState({
                            selectAll:false,
                            selection:''
                        })
                    }} 
                    {...extraProps}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.setState({
                                    selectedRowData: rowInfo.original,
                                    showEdit: true,
                                })
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            }
                        }
                    }}
                />
                <EditGatewayForm 
                    show= {this.state.showEdit} 
                    title='add comment'
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmit={this.handleSubmitForm}
                    handleClose={this.handleClose}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.deleteRecordGateway}
                />
            </Fragment>
        )
    }
}
export default GatewayTable
