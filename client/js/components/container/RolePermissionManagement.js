/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        RolePermissionManagement.js

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

import React from 'react'
import { Tabs, Tab, Button, Form as BootstrapForm } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import dataSrc from '../../dataSrc'
import Select from 'react-select'

// import Checkbox from '../../presentational/Checkbox'
import { Formik, Field, Form } from 'formik'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Checkbox(props) {
    return (
        <Field name={props.name}>
            {({ field, form }) => (
                <label>
                    <input
                        {...field}
                        type="checkbox"
                        checked={props.checked}
                        onChange={props.onChange}
                    />
                    {props.value}
                </label>
            )}
        </Field>
    )
}
class RolePermissionManagement extends React.Component {
    static contextType = AppContext

    state = {
        permissionList: [],
        rolesPermission: [],
        permissionType: ['form', 'route', 'user'],
    }

    columns = [
        {
            label: '',
            field: 'fold',
            sort: 'asc',
            width: 200,
        },
        {
            label: 'level',
            field: 'level',
            width: 200,
        },
        {
            label: 'chinese',
            field: 'chinese',
            width: 200,
        },
        {
            label: 'english',
            field: 'english',
            width: 200,
        },
        {
            label: 'remove',
            field: 'remove',
            width: 200,
        },
        {
            label: 'add',
            field: 'add',
            width: 200,
        },
    ]

    componentDidUpdate = (prevProps, prevState) => {}

    componentDidMount = () => {
        // this.getRolesPermission()
    }

    getRolesPermission = () => {
        axios
            .get(dataSrc.getRolesPermission)
            .then((res) => {
                const rolesList = res.data.roles_list.map((role) => {
                    return {
                        label: role.name,
                        value: role.name,
                        id: role.id,
                    }
                })
                this.setState({
                    permissionList: res.data.permission_list,
                    rolesPermission: res.data.roles_permission,
                    roleList: rolesList,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    addPermission = (type, e) => {
        axios
            .post(dataSrc.modifyPermission, {
                type: 'add permission',
                permissionType: type,
                name: 'new permission',
            })
            .then((res) => {
                this.getRolesPermission()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renamePermissionToState = (type, id, e) => {
        this.state.permissionList.map((permission) => {
            if (permission.id == id) {
                permission.name = `${type}:${e.target.value}`
                return
            }
        })
    }
    renamePermissionToBackend = (type, id, e) => {
        if (e.target.value) {
            axios
                .post(dataSrc.modifyPermission, {
                    type: 'rename permission',
                    permissionType: type,
                    id,
                    name: e.target.value,
                })
                .then((res) => {
                    this.getRolesPermission()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
    removePermission = (type, id, e) => {
        axios
            .post(dataSrc.modifyPermission, {
                type: 'remove permission',
                permissionType: type,
                id,
            })
            .then((res) => {
                this.getRolesPermission()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    onChangeRolesPermission = (sendPackage) => {
        axios
            .post(dataSrc.modifyRolesPermission, sendPackage)
            .then((res) => {
                this.getRolesPermission()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const { locale } = this.context
        return (
            <Tabs>
                <Tab eventKey="roleList" title={locale.texts.ROLE_LIST}>
                    <Formik
                        initialValues={{
                            ...this.state.permissionList.reduce(function (
                                map,
                                permission
                            ) {
                                map[
                                    permission.name.split(':').join('_')
                                ] = permission.name.split(':')[1]
                                return map
                            },
                            {}),
                            selectedRole: null,
                            rolePermission: [],
                            selectedPermission: [],
                        }}
                        validationSchema={<div></div>}
                        onSubmit={(values, { setStatus, setSubmitting }) => {}}
                        render={({
                            values,
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                            <Form className="text-capitalize">
                                <Select
                                    name="selectedRole"
                                    placeholder={
                                        locale.texts.SELECT_ROLE + '...'
                                    }
                                    options={this.state.roleList}
                                    value={values.selectedRole}
                                    onChange={(value) => {
                                        let selectedPermission = this.state.rolesPermission.filter(
                                            (role) => role.role.id == value.id
                                        )[0]
                                        selectedPermission = selectedPermission
                                            ? selectedPermission.permissions.map(
                                                (permission) =>
                                                    permission.name
                                            )
                                            : []

                                        setFieldValue('selectedRole', value)
                                        setFieldValue(
                                            'selectedPermission',
                                            selectedPermission
                                        )
                                    }}
                                />
                                <Container>
                                    <Row>
                                        {this.state.permissionType.map(
                                            (type) => {
                                                return (
                                                    <div key={type}>
                                                        <Col md={4}></Col>
                                                        <Col
                                                            md={4}
                                                            className="m-4 "
                                                        >
                                                            <h4 className="d-flex justify-content-center m-4">
                                                                {
                                                                    locale
                                                                        .texts[
                                                                            type.toUpperCase()
                                                                        ]
                                                                }
                                                            </h4>
                                                            {this.state.permissionList
                                                                .filter(
                                                                    (
                                                                        permission
                                                                    ) =>
                                                                        permission.name.split(
                                                                            ':'
                                                                        )[0] ==
                                                                        type
                                                                )
                                                                .map(
                                                                    (
                                                                        permission
                                                                    ) => {
                                                                        return (
                                                                            <Row
                                                                                key={
                                                                                    permission.name
                                                                                }
                                                                            >
                                                                                <BootstrapForm.Check
                                                                                    disabled={
                                                                                        !values.selectedRole
                                                                                    }
                                                                                    custom
                                                                                    type={
                                                                                        'switch'
                                                                                    }
                                                                                    id={`custom-${permission.name}`}
                                                                                    label={
                                                                                        permission.name.split(
                                                                                            ':'
                                                                                        )[1]
                                                                                    }
                                                                                    checked={values.selectedPermission.includes(
                                                                                        permission.name
                                                                                    )}
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        let commandType = null
                                                                                        if (
                                                                                            values.selectedPermission.includes(
                                                                                                permission.name
                                                                                            )
                                                                                        ) {
                                                                                            values.selectedPermission.splice(
                                                                                                values.selectedPermission.indexOf(
                                                                                                    permission.name
                                                                                                ),
                                                                                                1
                                                                                            )
                                                                                            commandType =
                                                                                                'remove permission'
                                                                                        } else {
                                                                                            values.selectedPermission.push(
                                                                                                permission.name
                                                                                            )
                                                                                            commandType =
                                                                                                'add permission'
                                                                                        }
                                                                                        setFieldValue(
                                                                                            'selectedPermission',
                                                                                            values.selectedPermission
                                                                                        )
                                                                                        const roleId =
                                                                                                values
                                                                                                    .selectedRole
                                                                                                    .id,
                                                                                            permissionId =
                                                                                                permission.id
                                                                                        this.onChangeRolesPermission(
                                                                                            {
                                                                                                type: commandType,
                                                                                                permissionId,
                                                                                                roleId,
                                                                                            }
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </Row>
                                                                        )
                                                                    }
                                                                )}
                                                        </Col>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </Row>
                                </Container>
                            </Form>
                        )}
                    />
                </Tab>
                <Tab
                    eventKey="permissionList"
                    title={locale.texts.PERMISSION_LIST}
                >
                    <Formik
                        initialValues={this.state.permissionList.reduce(
                            function (map, permission) {
                                map[
                                    permission.name.split(':').join('_')
                                ] = permission.name.split(':')[1]
                                return map
                            },
                            {}
                        )}
                        validationSchema={<div></div>}
                        onSubmit={(values, { setStatus, setSubmitting }) => {}}
                        render={({
                            values,
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                            <Form className="text-capitalize">
                                <Row>
                                    {this.state.permissionType.map((type) => {
                                        return (
                                            <Col
                                                lg={12}
                                                className="m-4"
                                                key={type}
                                            >
                                                <h5 className="d-flex justify-content-center">
                                                    {
                                                        locale.texts[
                                                            type.toUpperCase()
                                                        ]
                                                    }
                                                </h5>
                                                {this.state.permissionList
                                                    .filter(
                                                        (permission) =>
                                                            permission.name.split(
                                                                ':'
                                                            )[0] == type
                                                    )
                                                    .map((permission) => {
                                                        return (
                                                            <Row
                                                                key={
                                                                    permission.name
                                                                }
                                                            >
                                                                <Col lg={11}>
                                                                    <Field
                                                                        name={permission.name
                                                                            .split(
                                                                                ':'
                                                                            )
                                                                            .join(
                                                                                '_'
                                                                            )}
                                                                        type={
                                                                            'text'
                                                                        }
                                                                        className={
                                                                            'form-control my-1'
                                                                        }
                                                                        placeholder={
                                                                            permission.name.split(
                                                                                ':'
                                                                            )[1]
                                                                        }
                                                                        disabled={
                                                                            false
                                                                        }
                                                                        onChange={() => {}}
                                                                        onBlur={this.renamePermissionToBackend.bind(
                                                                            this,
                                                                            type,
                                                                            permission.id
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col lg={1}>
                                                                    <i
                                                                        className="fas fa-minus d-flex justify-content-center"
                                                                        onClick={this.removePermission.bind(
                                                                            this,
                                                                            type,
                                                                            permission.id
                                                                        )}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}
                                                <Row>
                                                    <Button
                                                        type={'button'}
                                                        className={
                                                            'form-control my-1'
                                                        }
                                                        variant="light"
                                                        onClick={this.addPermission.bind(
                                                            this,
                                                            type
                                                        )}
                                                    >
                                                        {
                                                            locale.texts
                                                                .ADD_PERMISSION
                                                        }
                                                    </Button>
                                                </Row>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Form>
                        )}
                    />
                </Tab>
            </Tabs>
        )
    }
}

export default RolePermissionManagement
