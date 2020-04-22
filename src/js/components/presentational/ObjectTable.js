import React from 'react';
import { 
    ButtonToolbar,
    Row,
    Col 
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../config/styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import EditObjectForm from '../container/EditObjectForm';
import BindForm from '../container/BindForm'
import DissociationForm from '../container/DissociationForm'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import Select from 'react-select';
import axios from 'axios';
import BOTInput from '../presentational/BOTInput'
import dataSrc from "../../dataSrc"
const SelectTable = selecTableHOC(ReactTable);
import {
    PrimaryButton
} from '../BOTComponent/styleComponent'
import AccessControl from '../presentational/AccessControl'
import messageGenerator from '../../service/messageGenerator' 
import { objectTableColumn } from '../../config/tables'
import retrieveDataHelper from '../../service/retrieveDataHelper'
import config from '../../config'


class ObjectTable extends React.Component{

    static contextType = AppContext

    state = {
        tabIndex:'', 
        isShowEdit:false,
        selectedRowData:'',
        selection: [],
        selectAll: false,
        isShowBind:false,
        showDeleteConfirmation:false,
        isShowEditImportTable:false,
        bindCase: 0,
        warningSelect : 0,
        selectAll: false, 
        formPath:'',
        formTitle:'',
        disableASN: false,
        done:false,
        data: [],
        columns: [],
        areaTable: [],
        objectTable: [],
        objectFilter: [],
        importData: [],
        filteredData: [],
        filterSelection: {
            statusOptions: config.statusOptions.map(item => {
                return {
                    value: item,
                    label: this.context.locale.texts[item.replace(/ /g, '_').toUpperCase()]
                }
            }),
            monitorTypeOptions: config.monitorOptions.map(item => {
                return {
                    value: item,
                    label: item 
                }
            }),
           
        },
    }

    componentDidMount = () => {
        this.getData()
        this.getAreaTable()
        this.getImportData()
    }

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

    getData = (callback) => {
        let { 
            locale,
            auth
        } = this.context

        retrieveDataHelper.getObjectTable(
            locale.abbr,
            auth.user.areas_id,
            [0, 1, 2]
        )
        .then(res => {
            let columns = _.cloneDeep(objectTableColumn)
            // let columnPatient = _.cloneDeep(patientTableColumn)
            let typeList = {} 

            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            let data = res.data.rows
                .filter(item => item.object_type == 0)
                .map(item => {

                    item.monitor_type = this.getMonitorTypeArray(item, 'object').join('/')

                    item.status = {
                        value: item.status,
                        label: item.status ? locale.texts[item.status.toUpperCase()] : null,
                    }
                    item.transferred_location = item.transferred_location 
                        ?   {
                            value: `${item.branch_id}, ${item.department_id}`,
                            label: `${item.department_name}, ${item.branch_name}` 
                        }
                        : ""

                    if (!Object.keys(typeList).includes(item.type)) { 
                        typeList[item.type] = {
                            value: item.type,
                            label: item.type
                        }
                    }
                    
                    item.area_name = {
                        value: item.area_name,
                        label: locale.texts[item.area_name],
                        id: item.area_id
                    }

                    return item
                }) 

            this.setState({
                data,
                isShowEdit: false,
                showDeleteConfirmation: false,
                disableASN: false,
                filteredData: data,
                columns,
                objectTable: res.data.rows,
                filterSelection: {
                    ...this.state.filterSelection,
                    typeList,
                }
            }, callback)

        })
        .catch(err => {
            console.log(err);
        })
    }

    getImportData = (callback) => {
        let { locale } = this.context
        axios.post(dataSrc.getImportTable, {
            locale: locale.abbr
        })
        .then(res => {
            this.setState({
                importData: res.data.rows,
            }, callback)
        })
        .catch(err => {
            console.log(err);
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

    handleClose = () => {
        this.setState({
            isShowBind:false,
            showDeleteConfirmation:false,
            isShowEditImportTable:false,
            isShowEdit:false,
            disableASN:false,
        })
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
        
        deleteArray.map( item => {
         
            this.state.data[item] === undefined ?
                null
                :
                formOption.push(this.state.data[item].mac_address)
            })
           
        axios.post(dataSrc.deleteDevice, {
            formOption
        })
        .then(res => {
            this.handleSubmitForm()
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleSubmitForm = () => {

        let callback = () => {
            messageGenerator.setSuccessMessage(
                'save success'
            )
        }
        this.getData(callback)
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


    handleClickButton = (e) => {

        let { name } = e.target
        
        switch(name) {
            case "add object": 
                this.setState({
                    isShowEdit: true,
                    formTitle: name,
                    selectedRowData: [],
                    formPath: dataSrc.addObject,
                    disableASN:false
                })
                break;
            case "associate":
                this.setState({
                    isShowBind: true,
                    bindCase: 1,
                })
            break; 

            case "deleteObject":
                this.setState({
                     showDeleteConfirmation: true,
                     warningSelect : 1
                })
                break;
  
            case "dissociation":
                this.setState({
                    formTitle: name,
                    isShowEditImportTable: true
                })
                break; 
        }

    }

    filterData = (data, key, filteredAttribute) => {
                    
        this.setState({
            loadingFlag:  true
        })
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
        let typeSelection = this.state.filterSelection.typeList ? Object.values(this.state.filterSelection.typeList) : null;

        return(
    
            <div> 
                <div className="d-flex justify-content-between">
                    <Row noGutters>
                        <Col>
                            <BOTInput
                                className='float-right'
                                placeholder={locale.texts.SEARCH}
                                getSearchKey={(key) => {
                                    this.addObjectFilter(
                                        key, 
                                        ['name', 'type', 'area', 'status', 'macAddress', 'acn'], 
                                        'search bar',
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
                                    name="Select Type"
                                    className="float-right w-100"
                                    styles={styleConfig.reactSelect}
                                    onChange={(value) => { 
                                        if(value){
                                            this.addObjectFilter(value.label, ['type'], 'type select' )
                                        }else{
                                            this.removeObjectFilter('type select')
                                        }
                                    }}
                                    options={typeSelection}
                                    isClearable={true}
                                    isSearchable={false}
                                    placeholder={locale.texts.TYPE}
                                    styles={styleConfig.reactSelectSearch}

                                />
                            </Col>
                            <Col >
                                <Select
                                    name="Select Area"
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
                                    placeholder={locale.texts.AREA}
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
                                            this.addObjectFilter(value.label, ['status'], 'status select')
                                        }else{
                                            this.removeObjectFilter('status select')
                                        }
                                    }}
                                    options={this.state.filterSelection.statusOptions}
                                    isClearable={true}
                                    isSearchable={false}
                                    placeholder={locale.texts.STATUS}
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
                                name="associate"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ASSOCIATE}
                            </PrimaryButton>
                            <PrimaryButton
                                name="add object"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ADD_OBJECT}
                            </PrimaryButton>
                            <PrimaryButton
                                name="dissociation"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DISSOCIATE}
                            </PrimaryButton>
                            <PrimaryButton 
                                name="deleteObject"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr/>
                {this.state.filteredData.length != 0 &&
                    <SelectTable
                        keyField='id'
                        data={this.state.filteredData}
                        columns={this.state.columns}
                        ref={r => (this.selectTable = r)}
                        className="-highlight text-none"

                        onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                        {...extraProps}
                        {...styleConfig.reactTable}
                        pageSize={this.state.filteredData.length}
                        style={{maxHeight:'75vh'}} 
                        getTrProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: (e) => {  
                                    if (!e.target.type) {
                                        this.setState({
                                            isShowEdit:true,
                                            selectedRowData: this.state.data[rowInfo.index],
                                            formTitle: 'edit object',
                                            formPath: dataSrc.editObject,
                                            disableASN:true
                                        })
                                    } 
                                },
                            }
                        }} 
                    />
                }
 
                <EditObjectForm 
                    show={this.state.isShowEdit} 
                    title={this.state.formTitle} 
                    selectedRowData={selectedRowData || ''} 
                    handleSubmitForm={this.handleSubmitForm}
                    handleClose={this.handleClose}
                    formPath={this.state.formPath}
                    data={this.state.data}
                    objectTable={this.state.objectTable}
                    disableASN = {this.state.disableASN  }
                    areaTable={this.state.areaTable}
                />     
                <BindForm
                    show = {this.state.isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable}
                    ImportData= {this.state.importData}
                    areaTable={this.state.areaTable}
                    data={this.state.importData.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item 
                        return dataMap
                        }, {})
                    }
                />
                <DissociationForm
                    show={this.state.isShowEditImportTable} 
                    title={this.state.formTitle} 
                    selectedRowData={this.state.selectedRowData || 'handleAllDelete'} 
                    handleSubmitForm={this.handleSubmitForm}
                    formPath={'xx'}
                    objectTable={this.state.objectTable}
                    refreshData={this.state.refreshData}
                    handleClose={this.handleClose}
                    data={this.state.objectTable.reduce((dataMap, item) => {
                        dataMap[item.mac_address] = item
                        return dataMap
                        }, {})
                    }
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={
                        this.state.warningSelect == 1 ?  this.objectMultipleDelete :null
                    }
                />
            </div>

        )
    }
}
export default ObjectTable
