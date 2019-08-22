require('dotenv').config();
const pg = require('pg');
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
}
const pool = new pg.Pool(config)

const queryTypeforUserInfo = require('./queryTypeforUserInfo').queryTypeforUserInfo 
const bcrypt = require('bcrypt');
const queryUserInfo = {
	signin : function(request, response){
	    const username = request.body.username
	    const pwd = request.body.password
	    const shift = request.body.shift

	    pool.query(queryTypeforUserInfo.query_signin(username), (error, results) => {
	        const hash = results.rows[0].password
	        if (error) {
	            console.log("Login Fails: " + error)
	        } else {

	            if (results.rowCount < 1) {
	                response.json({
	                    authentication: false,
	                    message: "Username or password is incorrect"
	                })
	            } else {
	                if (bcrypt.compareSync(pwd, hash)) {
	                    response.json({
	                        authentication: true,
	                    })
	                    pool.query(queryTypeforUserInfo.query_setShift(shift, username))
	                } else {
	                    response.json({
	                        authentication: false,
	                        message: "password is incorrect"
	                    })
	                }
	            }
	        }
	    })

	},
	signup: (request, response) => {
	    const { username, password} = request.body;
	    
	    const saltRounds = 10;
	    const hash = bcrypt.hashSync(password, saltRounds);
	    const signupPackage = {
	        username: username,
	        password: hash,
	    }
	    pool.query(queryTypeforUserInfo.query_signup(signupPackage), (error, results) => {

	        if (error) {
	            console.log(error)
	            console.log("Login Fails!")
	        } else {
	            console.log('Sign up Success')
	            // console.log(results.rows)
	        }

	        response.status(200).json(results)
	    })
	},
	modifyUserDevices: (request, response) => {
	    const {username, mode, acn} = request.body
	    pool.query(queryTypeforUserInfo.query_modifyUserDevices(username, mode, acn), (error, results) => {
	        if (error) {	            
	        } else {
	            console.log('Modify Success')
	        }
	        response.status(200).json(results)
	    })
	},
	userInfo: (request, response) => {
	    const username = request.body.username;
	    pool.query(queryTypeforUserInfo.query_getUserInfo(username), (error, results) => {
	        if (error) {
	            console.log('Get user info Fails!')
	        } else {
	            console.log('Get user info success')
	        }
	        response.status(200).json(results.rows)
	    })
	},
	userSearchHistory: (request, response) => {
	    const username = request.body.username;
	    pool.query(queryTypeforUserInfo.query_getUserSearchHistory(username), (error, results) => {
	        if (error) {
	            console.log('Get user search history Fails')
	        } else {
	            console.log('Get user search history success')
	        }
	        
	        response.status(200).json(results)
	    })
	},
	setUserRole: (request, response) => {
	    var {role, username} = request.body
	    var query = queryTypeforUserInfo.query_setUserRole(role, username)
	    pool.query(query,(error, results) => {
	        if(error){
	            console.log(error)
	        }else{
	            // console.log(results.rows)
	            response.send('success')
	        }
    	}
    )},
	getUserRole: (request, response) => {
	    var {username} = request.body
	    var query = queryTypeforUserInfo.query_getUserRole(username)
	    pool.query(query, (error, results) => {
	        if(error){
	            console.log(error)
	        }else{
	            response.send(results.rows)
	        }
	    })   
	},
	getShiftChangeRecord: (request, response) => {
	    var query = queryTypeforUserInfo.query_getShiftChangeRecord()
	    pool.query(query, (error, results) => {
	        if (error) {
	            console.log('save pdf file fails ' + error)
	        } else {
	            response.status(200).json(results)
	            console.log('save pdf file success')
	        }
	        
	    })   
	},

	getRoleNameList: (request, response) => {
	    var query = queryTypeforUserInfo.query_getRoleNameList()
	    pool.query(query, (error, results) => {

	        response.send(results.rows)
	    })   
	    
	},

	getUserList: (request, response) => {
	    var query = queryTypeforUserInfo.query_getUserList()
	    pool.query(query, (error, results) => {
	        // console.log(results)
	        var userList = results.rows
	        response.send(userList)
	    })  
	},
	removeUser: (request, response) => {
	    var username = request.body.username
	    var query = queryTypeforUserInfo.query_removeUser(username)

	    pool.query(query, (error, results) => {
	        // console.log(results)
	        if(error){
	            console.log(error)
	        }else{
	            console.log('success')
	            response.send('success')
	        }
	        
	    })  
	},
	getEditObjectRecord: (request, response) => {
		var query = queryTypeforUserInfo.query_getEditObjectRecord()
		console.log(query)
		pool.query(query, (error, results) => {
	        if(error){
	            console.log(error)
	        }else{
	            response.send(results.rows)
	        }
	        
	    }) 
	}
}
module.exports = {
	queryUserInfo
}