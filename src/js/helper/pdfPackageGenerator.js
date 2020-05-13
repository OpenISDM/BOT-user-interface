import moment from 'moment';

const pdfPackageGenerator = {

        /** Create pdf package, including header, body and the pdf path
     * options include shiftChange, searchResult, broken report, transffered report
     */
    getPdfPackage: (raw) => {
        let {
            option,
            user,
            data,
            locale,
            signature,
            additional,
            pdfOptions
        } = raw
        const header = pdfPackageGenerator.pdfFormat.getHeader(user, locale, option, signature, additional, data)
        const body = pdfPackageGenerator.pdfFormat.getBody[option](data, locale, user, location, signature, additional)
        const path = pdfPackageGenerator.pdfFormat.getPath(option, additional).path
        const pdf = header + body
        
        return {
            pdf,
            path,
            options: pdfOptions || pdfPackageGenerator.pdfFormat.pdfOptions
        }
    },

    FOLDER_PATH: {

        broken: `edit_object_record`,

        transferred: `edit_object_record`,

        shiftChange: `shift_record`,

        searchResult: `search_result`,

        patientRecord: `patient_record`,

        trackingRecord: `tracking_record`,

        contactTree: `contact_tree`,
    },

    PDF_FILENAME_TIME_FORMAT: "YYYY-MM-Do_hh_mm_ss",

    /** Pdf format pdfPackageGenerator */
    pdfFormat: {

        getHeader: (user, locale, option, signature, additional, data) => {
            let title = pdfPackageGenerator.pdfFormat.getTitle(option, locale)
            let subTitle = pdfPackageGenerator.pdfFormat.getSubTitle[option](locale, user, signature, additional, data)
            return title + subTitle
        },

        getTitle: (option, locale) => {
            return `
                <h3 style='text-transform: capitalize;'>
                    ${locale.texts[pdfPackageGenerator.pdfFormat.pdfTitle[option]].toUpperCase()}
                </h3>
            `
        },
    
        pdfTitle: {
            broken: 'REQUEST_FOR_DEVICE_REPARIE',
            transferred: 'DEVICE_TRANSFER_RECORD',
            shiftChange: 'SHIFT_CHANGE_RECORD',
            searchResult: 'SEARCH_RESULT',
            patientRecord: 'PATIENT_RECORD',
            trackingRecord: 'TRACKING_RECORD',
            contactTree: 'CONTACT_TREE'
        },
    

        getPath: (option, additional) =>{
            let directory = pdfPackageGenerator.FOLDER_PATH[option]
            let name = pdfPackageGenerator.pdfFormat.getFileName[option](option, additional)
            let path = `${directory}/${name}`
            return {
                directory,
                name,
                path
            }
        },
    
        getFileName: {
            broken: (option) => {
                return `${option}_report_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            transferred: (option) => {
                return `${option}_report_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            shiftChange: (option, additional) => {
                return `${additional.name}_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            searchResult: option => {
                return `${option}_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            patientRecord: option => {
                return `${option}_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            trackingRecord: (option, additional) => {
                return `${option}_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.${additional.extension}`
            },
            contactTree: (option, additional) => {
                return `${option}_${moment().format(pdfPackageGenerator.PDF_FILENAME_TIME_FORMAT)}.pdf`
            },
            
        },
    
        getBody: {
            broken: (data, locale) => {
                let title = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle('broken device list', locale)
                let list = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = pdfPackageGenerator.pdfFormat.getBodyItem.getNotes(data, locale)
                return title + list + notes
            },
            transferred: (data, locale, user, location,signature) => {

                let area = data[0].transferred_location_label
                let signature_title = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle('transferred to', locale, area)
                let list_title = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle('transferred device list', locale)
                let signatureName = pdfPackageGenerator.pdfFormat.getBodyItem.getSignature(locale,signature)
                let list = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(data, locale,signature)
                let notes = pdfPackageGenerator.pdfFormat.getBodyItem.getNotes(data, locale,signature)
                return signature_title + signatureName + list_title + list + notes
            },

            shiftChange: (data, locale, user) => {
                let area =  locale.texts[pdfPackageGenerator.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'devices found', 
                    locale, 
                    area,
                    data.searchResult.foundResult.length !== 0
                )
                let foundResultList = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.foundResult, 
                    locale
                )
                let notFoundTitle = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'devices not found', 
                    locale, 
                    area,
                    data.searchResult.notFoundResult.length !== 0
                )
                let notFoundResultList = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.notFoundResult, 
                    locale
                )
                let patientFoundTitle  = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'patients found', 
                    locale, 
                    area,
                    data.patients.foundPatients.length !== 0
                )

                let patientFoundList = pdfPackageGenerator.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.foundPatients, 
                    locale
                )

                let patientNotFoundTitle  = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'patients not found', 
                    locale, 
                    area,
                    data.patients.notFoundPatients.length !== 0
                )

                let patientNotFoundList = pdfPackageGenerator.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.notFoundPatients, 
                    locale
                )

                return (
                    foundTitle + 
                    foundResultList + 
                    notFoundTitle + 
                    notFoundResultList + 
                    patientFoundTitle + 
                    patientFoundList +
                    patientNotFoundTitle +
                    patientNotFoundList
                )
            },

            searchResult: (data, locale, user, location) => {
                let area =  locale.texts[pdfPackageGenerator.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'devices found', 
                    locale, 
                    area, 
                    data.foundResult.length !== 0
                )
                let foundResultList = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)
                let notFoundTitle = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'devices not found', 
                    locale, 
                    area,
                    data.notFoundResult.length !== 0
                )
                let notFoundResultList = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(data.notFoundResult, locale)
                return foundTitle + foundResultList + notFoundTitle + notFoundResultList
            },

            patientRecord: (data, locale, user) => {
                let title = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                    'patient historical record', 
                    locale, 
                    '',
                    true
                )
                let content = pdfPackageGenerator.pdfFormat.getBodyItem.getPatientData(
                    data, 
                    locale
                )

                return title + content
            },

            trackingRecord: (data, locale, user, location, signature, additional) => {
                let table;
                switch(additional.type) {
                    case 'name':
                        table = pdfPackageGenerator.pdfFormat.getBodyItem.getLocationHistoryByNameAsTable(data, locale)
                        break;
                    case 'uuid':
                        table = pdfPackageGenerator.pdfFormat.getBodyItem.getLocationHistoryByUUIDAsTable(data, locale)
                }                
                return table
            },

            contactTree: (data, locale, user, location) => {
                console.log(data)
                Object.keys(data).map(le)
                // let foundTitle = pdfPackageGenerator.pdfFormat.getBodyItem.getBodyTitle(
                //     'devices found', 
                //     locale, 
                //     area, 
                //     data.foundResult.length !== 0
                // )
                // let foundResultList = pdfPackageGenerator.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)

                
                    {Object.keys(data)
                        .filter(level => {
                            return level != 0 && Object.values(data[level].length != 0)
                        })
                        .map((level, index) => {
                            return (
                                <Col
                                    key={index}
                                    lg={2}
                                >
                                    {Object.keys(data[level])
                                        .filter(parent => data[level][parent].length != 0)
                                        .map((parent, index) => {
                                            return (
                                                <div>
                                                    <div>
                                                        {locale.texts.LEVEL} {level}
                                                    </div>
                                                    <Row
                                                        key={index}
                                                    >
                                                        <Col>
                                                            {parent}
                                                        </Col>
                                                        <Col>
                                                            <i class="fas fa-arrow-right"></i>                                                    
                                                        </Col>
                                                        <Col
                                                            className='d-flex-column'
                                                        >
                                                            {data[level][parent].map((child, index) => {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                    >
                                                                        {child}
                                                                    </div>
                                                                )
                                                            })}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                    })}                
                                </Col>
                            )
                        })}
                
                return 'test'
            },
        },
        getBodyItem: {

            getBodyTitle: (title, locale, area, hasTitle = true) => {
                return hasTitle 
                    ?   `
                        <h4 style='
                            text-transform: capitalize;
                            margin-bottom: 5px; 
                            padding-bottom: 5px;
                            border-bottom: 1px solid black;'
                        >
                            ${locale.texts[title.toUpperCase().replace(/ /g, '_')].toUpperCase()}
                            ${area ? area : ''}
                        </h4>
                    `
                    : ``;
            },
    
            getDataContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getLocationHistoryByName: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.area}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getLocationHistoryByNameAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th 
                            style='text-align: left'
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(' ')
                return `
                    <table 
                        style='width:100%; font-size: 0.8rem;'
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                    <td>${item.startTime}</td>
                                    <td>${item.endTime}</td>
                                    <td>${item.residenceTime}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getLocationHistoryByUUIDAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th
                            style='text-align: left'
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(' ')
                return `
                    <table 
                        style='width:100%; font-size: 0.8rem;'
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.mac_address}</td>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getPatientContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getPatientData: (data, locale) => {
                return data.records.map((item, index) => {
                    return `
                        <div style='margin-bottom: 15px;' key=${index}>
                            <div 
                                style='margin-bottom: 5px; margin-top: 0px;'
                            >
                                &bull;
                                <div
                                    style='display: inline-block'
                                >
                                    ${item.recorded_user}
                                </div>
                                &nbsp;
                                <div style='font-size: 0.8em;display: inline-block;'>
                                    ${moment(item.created_timestamp).locale(locale.abbr).format('lll')}
                                </div>
                            </div>
                            <div 
                                style='text-align: justify;text-justify:inter-ideograph;font-size: 0.8em'
                                class='text-muted'
                            >
                                ${item.record}
                            </div>
                        </div>
                    `
                }).join(' ')
            },
    
            getNotes: (data, locale) => {
                return `
                    <h3 style='text-transform: capitalize; margin-bottom: 5px; font-weight: bold'>
                        ${data[0].notes ? `${locale.texts.NOTE}:` : ''}
                    </h3>
                    <div style='margin: 10px;'>
                        ${data[0].notes ? data[0].notes : ''}
                    </div>
                `
            },

            getSignature: (locale,signature) => {
                return `
                    <div style='text-transform: capitalize; margin: 10px width: 200px;'>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_ID}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block'
                            />
                        </div>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_NAME}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block'
                            />   
                        </div>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_SIGNATURE}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block';
                                    value = ${signature}
                            />                  
                        </div>
                    </div>
                `
            }
        },
    
        getSubTitle: {
            shiftChange: (locale, user, signature, shiftOption) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)

                const lastShiftIndex = (pdfPackageGenerator.shiftOption.indexOf(shiftOption.value) + 2) % pdfPackageGenerator.shiftOption.length
                const lastShift = locale.texts[pdfPackageGenerator.shiftOption[lastShiftIndex].toUpperCase().replace(/ /g, '_')]
                const thisShift = shiftOption.label
                let shift = `<div style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT}: ${lastShift} ${locale.texts.SHIFT_TO} ${thisShift}
                    </div>`
                let confirmedBy = `<div style='text-transform: capitalize;'>
                    ${locale.abbr == 'en' 
                        ? `${locale.texts.CONFIRMED_BY} ${signature}`
                        : `${locale.texts.CONFIRMED_BY}: ${signature}`
                    }
                </div>`
                let checkby = `<div style='text-transform: capitalize;'>
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${user.name}, ${shiftOption.label}
                    </div>`
                return timestamp + confirmedBy + shift + checkby
            },
    
            searchResult: (locale, user) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                let username = pdfPackageGenerator.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            broken: (locale, user) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                let username = pdfPackageGenerator.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            transferred: (locale, user) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                let username = pdfPackageGenerator.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },

            patientRecord: (locale, user, name, additional, data) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                let patientName = pdfPackageGenerator.pdfFormat.getSubTitleInfo.patientName(locale, data)
                let providerName = pdfPackageGenerator.pdfFormat.getSubTitleInfo.providerName(locale, data)
                let patientID = pdfPackageGenerator.pdfFormat.getSubTitleInfo.patientID(locale, data)
                return timestamp + patientName + patientID + providerName
            },

            trackingRecord: (locale, user, name, additional, data) => {
                let {
                    key,
                    startTime,
                    endTime,
                    mode,
                } = additional

                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                key = pdfPackageGenerator.pdfFormat.getSubTitleInfo.field(locale, 'KEY', key)
                startTime = pdfPackageGenerator.pdfFormat.getSubTitleInfo.field(locale, 'START_TIME', startTime)
                endTime = pdfPackageGenerator.pdfFormat.getSubTitleInfo.field(locale, 'END_TIME', endTime)

                return timestamp + key + startTime + endTime
            },

            contactTree: (locale, user, name, additional, data) => {
                let timestamp = pdfPackageGenerator.pdfFormat.getTimeStamp(locale)
                return timestamp;
            },
        },
    
        getSubTitleInfo: {
            username: (locale, user) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.USERNAME}: ${user.name}
                    </div>
                `
            },
            patientName: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PATIENT_NAME}: ${object.name}
                    </div>
                `
            },
            patientID: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PATIENT_NUMBER}: ${object.asset_control_number}
                    </div>
                `
            },
            providerName: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PHYSICIAN_NAME}: ${object.physician_name}
                    </div>
                `
            },
            startTime: (locale, value) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.START_TIME}: ${value}
                    </div>
                `
            },
            field: (locale, key, value) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts[key]}: ${value}
                    </div>
                `
            }
        },

        /** The pdf option setting in html-pdf */
        pdfOptions: {
            'format': 'A4',
            'orientation': 'portrait',
            'border': '1cm',
            'timeout': '12000'
        },

        getTimeStamp: (locale) => {
            return `
                <div style='text-transform: capitalize;'>
                    ${locale.texts.DATE_TIME}: ${moment().locale(locale.abbr).format('LLL')}
                </div>
            `
        },
    },
    
}

export default pdfPackageGenerator