import React, {Fragment} from 'react';
import { 
    ButtonToolbar
} from 'react-bootstrap';
import ReactTable from 'react-table'
import axios from 'axios';
import { editObjectRecordTableColumn } from '../../../config/tables';
import dataSrc from '../../../dataSrc'
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm'
const SelectTable = selecTableHOC(ReactTable);
import { AppContext } from '../../../context/AppContext'
import retrieveDataHelper from '../../../service/retrieveDataHelper'
import styleConfig from '../../../config/styleConfig';
import AccessControl from '../../presentational/AccessControl'
import {
    PrimaryButton 
} from '../../BOTComponent/styleComponent'

class ObjectEditedRecord extends React.Component{

    static contextType = AppContext

    state = {
        data: [],
        columns: [],
        showForm: false,
        locale: this.context.locale.abbr,
        selectAll: false,
        selection: [],
        showDeleteConfirmation: false,
    }

    componentDidMount = () => {
        this.getData()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getData()
        }
    }

    getData = () => {
        let {
            locale
        } = this.context

        retrieveDataHelper.getEditObjectRecord(locale.abbr)
            .then(res => {
                let columns = _.cloneDeep(editObjectRecordTableColumn)
                columns.map(field => {
                    field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                    field.headerStyle = {
                        textAlign: 'left',
                        textTransform: 'capitalize'
                    }
                })
                res.data.rows.map((item, index) => {
                    item._id = index + 1
                    item.new_status = locale.texts[item.new_status.toUpperCase().replace(/ /g, '_')]
                })
                this.setState({
                    data: res.data.rows,
                    columns,
                    locale: locale.abbr
                })
            })
            .catch(err => {
                console.log(`get edited object record failed ${err}`)
            })
    }

    toggleAll = () => {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.selectTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array

            currentRecords.forEach(item => {
                if (item._original) {
                selection.push(item._original._id);
                }
            });
        }
        this.setState({ selectAll, selection });
    };

    toggleSelection = (key, shift, row) => {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */

        let selection = [...this.state.selection];
     
        key = typeof key === 'number' ? key : parseInt(key.split('-')[1])
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

    }

    isSelected = (key) => {
        /*
            Instead of passing our external selection state we provide an 'isSelected'
            callback and detect the selection state ourselves. This allows any implementation
            for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    }

    deleteRecord = () => {

        let idPackage = []
        this.state.selection.map( item => {
            idPackage.push(parseInt(this.state.data[item - 1].id))
        })
        axios.post(dataSrc.deleteEditObjectRecord, {
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

    render(){

        const { 
            locale 
        } = this.context

        const {
            toggleSelection,
            toggleAll,
            isSelected,
        } = this;

        const { selectAll, selectType } = this.state;


        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        return (
            <Fragment>
                <div className="d-flex justify-content-start">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >     
                        <ButtonToolbar>                    
                            <PrimaryButton
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
                
                {this.state.data && (
                    <SelectTable
                        keyField='_id'
                        data={this.state.data}
                        columns={this.state.columns}
                        ref={r => (this.selectTable = r)}
                        className="-highlight"
                        pageSize={this.state.data.length}
                        style={{maxHeight:'80vh'}}                             
                        {...extraProps}
                        {...styleConfig.reactTable}
                        getTrProps={(state, rowInfo, column, instance) => {
                          
                            return {
                                onClick: (e, handleOriginal) => {
                                    let id = rowInfo.original._id
                                    this.toggleSelection(id)
                        
                                    if (handleOriginal) {
                                        handleOriginal()
                                    }
                                    window.open(dataSrc.pdfUrl(rowInfo.original.file_path));
                                }
                            }
                        }}
                    />)
                }
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleCloseDeleteConfirmForm}
                    handleSubmit={this.handleSubmitDeleteConfirmForm}
                />
            </Fragment>
        )
    }
}

export default ObjectEditedRecord