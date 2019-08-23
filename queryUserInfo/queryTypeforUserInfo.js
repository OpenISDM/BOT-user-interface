const queryTypeforUserInfo = {
	query_signin : (username) => {

		const text =
			`SELECT password FROM user_table WHERE name= $1`;
		const values = [username];
		const query = {
			text,
			values
		};
		return query;
	},
	query_setShift: (shift, username) => {
		const query = `update user_table
						set shift='${shift}'
						where name='${username}'
						`
		return query
	},
	query_signup: (signupPackage) => {

		const query = 
			`
			with CTE as(
				INSERT INTO user_table (name, password)
				VALUES ('${signupPackage.username}', '${signupPackage.password}')
				returning id
			)
			insert into user_roles(user_id, role_id) values ((select * from CTE), 1)
				
			
			;
			
			`
		return query
	},
	query_modifyUserDevices: (username, mode, acn) => {
		var text = ""
		if(mode === 'add'){
			if(acn === 'all'){
				text =`UPDATE user_table SET mydevice =(select array_agg(access_control_number) from  object_table) WHERE name = '${username}';`
			}
			else{
				text = `UPDATE user_table SET mydevice = array_append(mydevice, '${acn}') WHERE name = '${username}';`
			}	
		}else if(mode === 'remove'){
			if(acn === 'all'){
				text =`UPDATE user_table SET mydevice='{}' WHERE name = '${username}';`
			}
			else{
				text = `UPDATE user_table SET mydevice = array_remove(mydevice, '${acn}') WHERE name = '${username}';`
			}			
		}else{
			text = ""
		}
		return text
		
	},
	query_getUserInfo: (username) => {
		const text =  `
			SELECT name, mydevice from user_table where name= $1
		`;
		const values = [username];
		const query = {
			text,
			values
		};

		return query
	},
	query_getUserSearchHistory: (username) => {
		const text = `
			SELECT search_history from user_table where name=$1
		`;

		const values = [username];

		const query = {
			text,
			values
		};

		return query
	},
	query_setUserRole: (role, username) => {
		const query = `update user_roles
						set role_id=(select id from roles where name='${role}')
						where user_roles.user_id = (select id from user_table where name='${username}');
		`
		return query
	},
	query_getUserRole:(username) => {
		const query = `select name      from roles      where 
		    id=(       select role_id   from user_roles where 
		    user_id=(  select id        from user_table where name='${username}'));`
		return query
	},
	query_getShiftChangeRecord: () => {
		const query = `SELECT * FROM shift_change_record`
		return query
	},
	query_getRoleNameList: () => {
		const query = `select name from roles;`
		return query
	},
	query_getUserList: () => {
		const query = `select a.*, b.name AS role_type from user_table a INNER JOIN (SELECT * from user_roles a INNER JOIN roles b ON a.role_id=b.id) b ON a.id = b.user_id`
		return query
	},
	query_removeUser: (username) => {
		const query = `delete from user_roles where user_id=(select id from user_table where name='${username}'); delete from user_table where name = '${username}';`
		return query
	},
	query_getEditObjectRecord: () => {
		const query = `select * from edit_object_record;`
		return query
	}
}
module.exports = {
	queryTypeforUserInfo
}