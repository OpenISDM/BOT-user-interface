import React from 'react';
import { 
    ButtonToolbar 
} from 'react-bootstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import EditLbeaconForm from './../presentational/EditLbeaconForm'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import config from '../../config';
import { 
    lbeaconTableColumn,
} from '../../config/tables';
import { AppContext } from '../../context/AppContext';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm';
import retrieveDataHelper from '../../service/retrieveDataHelper';
import styleConfig from '../../config/styleConfig';
import {
    PrimaryButton
} from '../BOTComponent/styleComponent';
import AccessControl from '../presentational/AccessControl';
import messageGenerator from '../../service/messageGenerator';

const SelectTable = selecTableHOC(ReactTable);

class LbeaconTable extends React.Component{
    
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
        this.getLbeaconDataInterval = setInterval(this.getData, config.getLbeaconDataIntervalTime)
    }

    componentWillUnmount = () => {
        clearInterval(this.getLbeaconDataInterval);
    }

    getData = (callback) => {

        let { locale } = this.context
        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res => {
            this.props.setMessage('clear')
            let column = _.cloneDeep(lbeaconTableColumn)
            column.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            this.setState({
                data: res.data.rows,
                columns: column,
                showEdit: false,
                showDeleteConfirmation: false,
                selectedRowData: '',
                selectAll :false,
                selectType:'',
                selection: [],
                locale: locale.abbr
            }, callback) 
        })
        .catch(err => {
            this.props.setMessage(
                'error', 
                'connect to database failed',
                true,
            )
            console.log(`get lbeacon data failed ${err}`);
        })

    }

    handleClose = () => {
        this.setState({ 
            showDeleteConfirmation: false,
            selectedRowData: '',
            showEdit: false, 
            selectAll :false,
            selectType:''
        })
    }  

    handleSubmitForm = (formOption) => {
        let callback = () => messageGenerator.setSuccessMessage(
            'save success'
        ) 
        axios.put(dataSrc.lbeacon, {
            formOption,
        }).then(res => {
            this.getData(callback) 
        }).catch(err => {
            console.log(`edit lbeacon failed ${err}`)
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
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item.id)
                } 
            });
        } else {
            selection = [];
        }
        this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };
 
    deleteRecord = () => {
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
            axios.delete(dataSrc.lbeacon, {
                data: {
                    idPackage
                }
            })
            .then(res => {
                this.getData(() => {
                    this.props.setMessage(
                        'success', 
                        'delete lbeacon success'
                    )
                })
            })
            .catch(err => {
                console.log(`delete lbeacon failed ${err}`)
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
            <div>  
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
                        name="test"
                        data={this.state.data}
                        columns={this.state.columns}
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
                                        showEdit: true,
                                    })
                                }
                            }
                        }}
                    />
                }
                <EditLbeaconForm 
                    show= {this.state.showEdit} 
                    title={'edit lbeacon'}
                    selectedObjectData={this.state.selectedRowData} 
                    handleSubmit={this.handleSubmitForm}
                    handleClose={this.handleClose}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.deleteRecord}
                />
            </div>

        )
    }
}
export default LbeaconTable
