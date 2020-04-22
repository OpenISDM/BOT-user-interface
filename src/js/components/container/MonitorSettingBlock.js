import React from 'react';
import { AppContext } from '../../context/AppContext';
import { 
    ButtonToolbar,
    Button
} from "react-bootstrap"
import axios from "axios"
import dataSrc from "../../dataSrc"
import config from "../../config"
import ReactTable from 'react-table';
import styleConfig from '../../config/styleConfig';
import EditMonitorConfigForm from '../presentational/EditMonitorConfigForm';
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import { monitorConfigColumn } from '../../config/tables'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import messageGenerator from '../../service/messageGenerator'
const SelectTable = selecTableHOC(ReactTable);
import {
    PrimaryButton
} from '../BOTComponent/styleComponent'
import AccessControl from '../presentational/AccessControl'

class MonitorSettingBlock extends React.Component{

    static contextType = AppContext

    state = {
        type: config.monitorSettingUrlMap[this.props.type],
        data: [],
        columns: [],
        path: '',
        areaOptions: [],
        isEdited: false,
        selection: [],
        selectAll: false,
        exIndex : 9999,
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => { 
        this.getMonitorConfig()
    }
 
 
    getMonitorConfig = (callback) => { 
        let { 
            auth,
            locale
        } = this.context 
        axios.post(dataSrc.getMonitorConfig, {
            type: config.monitorSettingUrlMap[this.props.type],
            areasId: auth.user.areas_id,
            roles:auth.user.roles
        })
        .then(res => { 
            let columns = _.cloneDeep(monitorConfigColumn)

            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            }) 
            res.data.map((item,index) => {
                item.area = {
                    value: config.mapConfig.areaOptions[item.area_id],
                    label: locale.texts[config.mapConfig.areaOptions[item.area_id]],
                    id: item.area_id
                }
            }) 
            this.setState({
                data: res.data,
                columns,
                show: false,
                showDeleteConfirmation: false,
                selectedData: null,
                selection: '',
                selectAll:false
            }, callback)
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleSubmit = (pack) => { 
        let configPackage = pack ? pack : {}
        let { 
            path,
            selectedData
        } = this.state  
        configPackage["type"] = config.monitorSettingUrlMap[this.props.type]
        // configPackage["id"] = selectedData ? selectedData.id : null;
        configPackage["id"] = this.state.selection   
        if (configPackage["id"] == "" && this.state.selectedData != null){configPackage["id"] = this.state.selectedData.id }  
        axios.post(dataSrc[path], {
            monitorConfigPackage: configPackage
        })
        .then(res => {  
            let callback = () => messageGenerator.setSuccessMessage(
                'save success'
            )   
            this.getMonitorConfig(callback)
        })
        .catch(err => { 
            console.log(err)
        }) 
    }

    handleClose = () => {
        this.setState({
            show: false,
            showDeleteConfirmation: false,
            selectedData: null, 
        })
    }


    handleClickButton = (e, value) => {
        let { name } = e.target   
        switch(name) {
            case "add rule": 
                this.setState({
                    show: true,
                    isEdited: false,
                    path: 'addMonitorConfig'
                })
                break;
            case "edit":
                this.setState({
                    show: true,
                    selectedData: value.original,
                    isEdited: true,
                    path: 'setMonitorConfig'
                })
                break;
            case "delete":
                this.setState({
                    showDeleteConfirmation: true,
                    path: 'deleteMonitorConfig', 
                })
                break;
        }
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


    componentDidUpdate = (prevProps, prevState) =>{ 
        if (this.state.exIndex != this.props.nowIndex){
            this.setState({selectAll : false,selection:'',exIndex:this.props.nowIndex}) 
        }
        if (this.context.locale.abbr !== prevState.locale) { 
            this.getMonitorConfig()
            this.setState({
                locale: this.context.locale.abbr
            })
        }
    } 

    render() {
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

        let { 
            locale 
        } = this.context

        let {
            type
        } = this.props

        let {
            isEdited
        } = this.state

        let areaOptions = Object.values(config.mapConfig.areaModules)
            .map((area, index) => {
                return {
                    value: area.name,
                    label: locale.texts[area.name],
                    id: area.id
                }
            }) 

 
        let title = `edit ${type}`.toUpperCase().replace(/ /g, '_')

        return ( 
            <div>  
                <div className="d-flex justify-content-start">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <PrimaryButton
                                className='mr-2 mb-1'
                                name="add rule"
                                onClick={this.handleClickButton}
                            >
                                {locale.texts.ADD_RULE}
                            </PrimaryButton>
                            <PrimaryButton
                                className='mr-2 mb-1'
                                name="delete"
                                onClick={this.handleClickButton} 
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
                    className="-highlight"
                    minRows={0} 
                    {...extraProps}
                    {...styleConfig.reactTable}
                    getTrProps={(state, rowInfo, column, instance) => {   
                          return {
                              onClick: (e, handleOriginal) => {  
                                  this.setState({ 
                                    selectedData: rowInfo.row._original,
                                    show: true, 
                                    isEdited: true,
                                    path: 'setMonitorConfig'
                                })
                              }
                          }
                      }}
                />
                <EditMonitorConfigForm
                    handleShowPath={this.show} 
                    selectedData={this.state.selectedData}
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    title={title}
                    type={config.monitorSettingUrlMap[this.props.type]} 
                    handleSubmit={this.handleSubmit}
                    areaOptions={areaOptions}
                    isEdited={isEdited}
                />
                <DeleteConfirmationForm 
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default MonitorSettingBlock