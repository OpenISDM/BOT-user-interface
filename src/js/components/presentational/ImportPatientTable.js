/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ImportPatientTable.js

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

import React, { Fragment } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import ReactTable from 'react-table'
import selecTableHOC from 'react-table/lib/hoc/selectTable'
import InputFiles from 'react-input-files'
import DeleteConfirmationForm from '../presentational/DeleteConfirmationForm'
import styleConfig from '../../config/styleConfig'
import messageGenerator from '../../helper/messageGenerator'
import { PrimaryButton } from '../BOTComponent/styleComponent'
import AccessControl from '../authentication/AccessControl'
import { importTableColumn } from '../../config/tables'
import apiHelper from '../../helper/apiHelper'
import { JSONClone } from '../../helper/utilities'

const SelectTable = selecTableHOC(ReactTable)

class ImportPatientTable extends React.Component {
    static contextType = AppContext

    state = {
        selection: [],
        selectAll: false,
        showDeleteConfirmation: false,
        filetext: '',
        data: [],
        columns: [],
        locale: this.context.locale.abbr,
        disable: true,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr != prevState.locale) {
            this.getData()
        }
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        const { locale } = this.context

        apiHelper.importedObjectApiAgent
            .getImportedObjectTable({
                locale: locale.abbr,
            })
            .then((res) => {
                const columns = JSONClone(importTableColumn)
                columns.map((field) => {
                    field.Header =
                        locale.texts[
                            field.Header.toUpperCase().replace(/ /g, '_')
                        ]
                })
                const data = res.data.rows.filter(
                    (item) => item.type == 'patient'
                )
                this.setState({
                    data,
                    columns,
                    showDeleteConfirmation: false,
                    locale: locale.abbr,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleClose = () => {
        this.setState({
            showDeleteConfirmation: false,
        })
    }

    handleSubmitForm = () => {
        const callback = () =>
            messageGenerator.setSuccessMessage('save success')
        this.getData(callback)
    }

    toggleSelection = (key, shift, row) => {
        let selection = [...this.state.selection]
        selection != ''
            ? this.setState({ disable: true })
            : this.setState({ disable: false })

        let splitKey = ''
        if (key.split('-')[1]) {
            for (let i = 1; i < key.split('-').length; i++) {
                splitKey += key.split('-')[i]
                i != key.split('-').length - 1 ? (splitKey += '-') : null
            }
        }

        key = key.split('-')[1] ? splitKey : key
        const keyIndex = selection.indexOf(key)
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1),
            ]
        } else {
            selection.push(key)
        }
        this.setState({
            selection,
        })
    }

    toggleAll = () => {
        const selectAll = !this.state.selectAll
        let selection = []
        let rowsCount = 0
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance()
            // const currentRecords = wrappedInstance.props.data
            const currentRecords = wrappedInstance.getResolvedState().sortedData

            currentRecords.forEach((item) => {
                rowsCount++
                if (
                    rowsCount >
                        wrappedInstance.state.pageSize *
                            wrappedInstance.state.page &&
                    rowsCount <=
                        wrappedInstance.state.pageSize +
                            wrappedInstance.state.pageSize *
                                wrappedInstance.state.page
                ) {
                    selection.push(item._original.asset_control_number)
                }
            })
        } else {
            selection = []
        }
        selection == ''
            ? this.setState({ disable: true })
            : this.setState({ disable: false })
        this.setState({ selectAll, selection })
    }

    isSelected = (key) => {
        return this.state.selection.includes(key)
    }

    deleteRecordImport = () => {
        this.setState({ selectAll: false })

        apiHelper.importedObjectApiAgent
            .deleteImportedObject({
                idPackage: this.state.selection,
            })
            .then((res) => {
                this.setState({ selection: [] })
                this.handleSubmitForm()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleClickButton = (e) => {
        const { name } = e.target
        switch (name) {
            case 'delete':
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect: 2,
                })
                break
        }
    }

    onImportExcel = (files) => {
        // 獲取上傳的文件對象
        //const { files } = file.target; // 通過FileReader對象讀取文件
        const fileReader = new FileReader()
        //console.log(fileReader);

        const { locale } = this.context

        if (files.length != 0) {
            //避免按下取消後的bug
            for (let index = 0; index < files.length; index++) {
                fileReader.name = files[index].name
            }
        }
        fileReader.onload = async (event) => {
            try {
                // 判斷上傳檔案的類型 可接受的附檔名
                const validExts = new Array('.xlsx', '.xls')
                const fileExt = event.target.name

                if (fileExt == null) {
                    throw '檔案為空值'
                }

                const fileExtlastof = fileExt.substring(
                    fileExt.lastIndexOf('.')
                )
                if (validExts.indexOf(fileExtlastof) == -1) {
                    throw (
                        '檔案類型錯誤，可接受的副檔名有：' +
                        validExts.toString()
                    )
                }

                const { result } = event.target // 以二進制流方式讀取得到整份excel表格對象
                let data = [] // 存儲獲取到的數據 // 遍歷每張工作表進行讀取（這裡默認只讀取第一張表）

                await import(
                    /* webpackChunkName: "xlsx" */
                    'xlsx'
                ).then((XLSX) => {
                    const workbook = XLSX.read(result, { type: 'binary' })

                    for (const sheet in workbook.Sheets) {
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                            data = data.concat(
                                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                            ) // break; // 如果只取第一張表，就取消註釋這行
                        }
                    }
                })

                // ＩＭＰＯＲＴ時把ＡＣＮ重複的擋掉
                const newData = []
                let reapetFlag = false
                let DataNameIsNull = ''
                let ReapeName = ''
                const checkArray = []
                let punctuationFlag = false

                data.map((importData) => {
                    reapetFlag = false

                    this.state.data.map((dataOrigin) => {
                        importData.asset_control_number ==
                        dataOrigin.asset_control_number
                            ? (reapetFlag = true)
                            : null
                    })
                    if (reapetFlag == false) {
                        if (importData.asset_control_number != undefined) {
                            if (checkArray != '') {
                                checkArray.indexOf(
                                    importData.asset_control_number
                                ) != -1
                                    ? (ReapeName += importData.name + ' ')
                                    : newData.push(importData)
                            } else {
                                newData.push(importData)
                            }
                            checkArray.push(importData.asset_control_number)
                        } else {
                            DataNameIsNull += importData.name + ','
                        }
                    } else {
                        ReapeName += importData.name + ' '
                    }
                })

                newData.map((item) => {
                    item.name.toString().indexOf("'") != -1 ||
                    item.name.toString().indexOf('"') != -1
                        ? (punctuationFlag = true)
                        : null
                    item.asset_control_number.toString().indexOf("'") != -1 ||
                    item.asset_control_number.toString().indexOf('"') != -1
                        ? (punctuationFlag = true)
                        : null
                    item.type = 'patient'
                })

                if (punctuationFlag) {
                    messageGenerator.importErrorMessage('NOT_ALLOW_PUNCTUATION')
                } else if (DataNameIsNull != '') {
                    messageGenerator.importErrorMessage(
                        'ASSET_CONTROL_NUMBER_IS_REQUIRED',
                        DataNameIsNull
                    )
                } else if (ReapeName != '') {
                    messageGenerator.importErrorMessage(
                        'ASN_IS_REPEAT',
                        ReapeName
                    )
                } else {
                    apiHelper.importedObjectApiAgent
                        .addImportedObject({
                            locale: locale.abbr,
                            newData,
                        })
                        .then((res) => {
                            this.handleSubmitForm()
                            const callback = () =>
                                messageGenerator.setSuccessMessage(
                                    'save success'
                                )
                            callback()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            } catch (e) {
                // 這裡可以拋出文件類型錯誤不正確的相關提示
                alert(e)
                //console.log('文件類型不正確');
                return
            }
        } // 以二進制方式打開文件

        if (files.length != 0) {
            //避免按下取消後的bug
            fileReader.readAsBinaryString(files[0])
            fileReader.onloadend = () => {
                this.setState({ filetext: fileReader.result })
            }
        }
    }

    render() {
        const { locale } = this.context

        const { selectAll, selectType } = this.state

        const { toggleSelection, toggleAll, isSelected } = this

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType,
        }

        return (
            <Fragment>
                <div className="d-flex justify-content-between">
                    <AccessControl
                        renderNoAccess={() => null}
                        platform={['browser', 'tablet']}
                    >
                        <ButtonToolbar>
                            <InputFiles
                                accept=".xlsx, .xls"
                                name="import_patient"
                                onChange={this.onImportExcel}
                            >
                                <PrimaryButton className="mr-2 mb-1">
                                    {locale.texts.IMPORT_OBJECT}
                                </PrimaryButton>
                            </InputFiles>
                            <PrimaryButton
                                className="text-capitalize mr-2 mb-1"
                                name="delete"
                                onClick={this.handleClickButton}
                                disabled={this.state.selection.length == 0}
                            >
                                {locale.texts.DELETE}
                            </PrimaryButton>
                        </ButtonToolbar>
                    </AccessControl>
                </div>
                <hr />
                <SelectTable
                    keyField="asset_control_number"
                    data={this.state.data}
                    columns={this.state.columns}
                    ref={(r) => (this.selectTable = r)}
                    className="-highlight"
                    style={{ maxHeight: '75vh' }}
                    onSortedChange={(e) => {
                        this.setState({ selectAll: false, selection: '' })
                    }}
                    onPageChange={(e) => {
                        this.setState({ selectAll: false, selection: '' })
                    }}
                    {...extraProps}
                    {...styleConfig.reactTable}
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation}
                    handleClose={this.handleClose}
                    handleSubmit={
                        this.state.warningSelect == 2
                            ? this.deleteRecordImport
                            : null
                    }
                />
            </Fragment>
        )
    }
}

export default ImportPatientTable
