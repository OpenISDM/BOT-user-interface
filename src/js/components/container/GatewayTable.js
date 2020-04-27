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
import retrieveDataHelper from '../../service/retrieveDataHelper'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm' 
import BOTCheckbox from '../presentational/BOTCheckbox'
import styleConfig from '../../config/styleConfig'
import messageGenerator from '../../service/messageGenerator'
const SelectTable = selecTableHOC(ReactTable);
import {
    PrimaryButton
} from '../BOTComponent/styleComponent'
import AccessControl from '../presentational/AccessControl'

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
        selectType:''
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
        retrieveDataHelper.getGatewayTable(
            locale.abbr
        )
        .then(res => {
            this.props.setMessage('clear')
            let column = _.cloneDeep(gatewayTableColumn)
            column.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                data: res.data.rows,
                columns: column,
                locale: locale.abbr,
                selection: [],
                selectAll: false,
                showDeleteConfirmation: false
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
            const currentRecords = wrappedInstance.props.data
 
            // const currentRecords = wrappedInstance.getResolvedState().sortedData;
            
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item.id)
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
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                {this.state.data.length != 0 &&
                    <SelectTable
                        keyField='id'
                        data={this.state.data} 
                        columns={this.state.columns}
                        SelectAllInputComponent={BOTCheckbox}
                        SelectInputComponent={BOTCheckbox}
                        {...styleConfig.reactTable}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        pageSize={this.state.data.length}
                        style={{maxHeight:'75vh'}}                     
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
                                    })
                                    if (handleOriginal) {
                                        handleOriginal()
                                    }
                                }
                            }
                        }}
                    />
                    }
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
