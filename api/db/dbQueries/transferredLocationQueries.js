/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        transferredLocationQueries.js

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

export default {
    getAllTransferredLocation: () => {
        return `
			SELECT
				name,
				ARRAY_AGG(JSON_BUILD_OBJECT(
					'id', branches.id,
					'value', branches.department
				)) AS departments
			FROM branches
			GROUP BY
				branches.name
			ORDER BY name
		`
    },

    editTransferredLocation: (type, data) => {
        const defaultNewDepartment = 'new department'

        let query

        if (type == 'add branch') {
            query = `insert into branch_and_department(branch_name, department) values('${data.name}', '{"${data.departmentName}"}')`
        } else if (type == 'rename branch') {
            query = `update branch_and_department set branch_name = '${data.name}' where id = ${data.branch_id} `
        } else if (type == 'remove branch') {
            query = `delete from branch_and_department where id = ${data.branch_id} `
        } else if (type == 'add department') {
            query = `update branch_and_department set department = array_append(department, '${data.name}') where id = ${data.branch_id}`
        } else if (type == 'rename department') {
            query = `update branch_and_department set department[${
                data.departmentIndex + 1
            }] = '${data.name}' where id = ${data.branch_id}`
        } else if (type == 'remove department') {
            query = `update branch_and_department set department = array_remove(department, department[${
                data.departmentIndex + 1
            }]) where id = ${data.branch_id}`
        } else {
            console.log('modifyTransferredLocation: unrecognized command type')
        }

        return query
    },

    editLocation: (name, departmentName) => {
        const text = `
			INSERT INTO branches (
				name,
				department
			) values (
				$1,
				$2
			)
		`

        const values = [name, departmentName]

        return {
            text,
            values,
        }
    },
}
