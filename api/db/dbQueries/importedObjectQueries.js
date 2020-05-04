module.exports = {

    getImportedObject: () => {
        let text = `
            SELECT 
                import_table.name, 
                import_table.asset_control_number,
                import_table.type,
                import_table.id
            FROM import_table WHERE import_table.type = 'patient'
        `;
        
        return text
    }, 

    deleteImporedtObject: (idPackage) => {
        const query = `
            DELETE FROM import_table
            WHERE asset_control_number IN (${idPackage.map(item => `'${item}'`)});

            DELETE FROM object_table
            WHERE asset_control_number IN (${idPackage.map(item => `'${item}'`)});
        `
        return query
    },

    addImportedObject: (idPackage) => {
        let text =  `
            INSERT INTO import_table (
                name,
                type,
                asset_control_number
            )
            VALUES ${idPackage.map((item) => {
                return `(
                    '${item.name}',
                    '${item.type}',
                    '${item.asset_control_number}'
                )`
            })};
        `
        return text	
    },
}
