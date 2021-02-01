const getAllGateway = `
	SELECT
		*
	FROM
		gateway_table
	ORDER BY ip_address DESC
`

const deleteGateway = (ids) => {
	const query = `
		DELETE FROM gateway_table
		WHERE id IN (${ids.map((id) => `'${id}'`)});
	`
	return query
}

const editGateway = (formOption) => {
	const text = `
		UPDATE gateway_table
		SET
            comment = $2

		WHERE id = $1
	`

	const values = [formOption.id, formOption.comment]

	const query = {
		text,
		values,
	}

	return query
}

export default {
	getAllGateway,
	deleteGateway,
	editGateway,
}
