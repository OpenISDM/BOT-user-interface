const getImportedObject = () => {
	let text = `
        SELECT 
            import_table.name, 
            import_table.asset_control_number,
            import_table.type,
            import_table.id
        FROM import_table WHERE import_table.type = 'patient'
    `;
	
	return text
} 

module.exports = {
    getImportedObject
}