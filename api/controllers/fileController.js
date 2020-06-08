/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        fileController.js

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

require('dotenv').config();
require('moment-timezone');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs')
const pdf = require('html-pdf'); 
const { Parser } = require('json2csv');

module.exports = { 

    exportCSV: (req, res) => {
        let {
            fields,
            data,
            filePackage
        } = req.body 

        let folderPath = path.join(process.env.LOCAL_FILE_PATH, filePackage.directory)

        if (!fs.existsSync(process.env.LOCAL_FILE_PATH)) {
            fs.mkdirSync(process.env.LOCAL_FILE_PATH);
        }
    
        if (!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    
        let filePath = path.join(process.env.LOCAL_FILE_PATH, filePackage.path)

        const json2csvParser = new Parser({ fields });
        var csv = json2csvParser.parse(data);
        var options = {
            encoding:"utf8"
        }; 

		fs.writeFile(filePath, "\ufeff"+csv,options, function(err) {
			if(err) {
				console.log(err);
			} else {
                res.status(200).json(data)
                console.log('the csv file was written successfully')			
            }
		}); 
       
        // const csvWriter = createCsvWriter({
        //     path: filePath,
        //     header,
        //     encoding: 'utf8'
        // });
        
    
        // csvWriter
        //     .writeRecords(data)
        //     .then((data)=> {
        //         console.log('the csv file was written successfully')
        //         res.status(200).json(data)
        //     });
    },

    getFile: (req, res) => {
        res.sendFile(path.join(`${process.env.LOCAL_FILE_PATH}`, `${req.params.folder}`,req.params.file));
    },

    exportPDF: (request, response) => {
        const { 
            pdfPackage, 
        } = request.body
        pdf.create(pdfPackage.pdf, pdfPackage.options).toFile(path.join(process.env.LOCAL_FILE_PATH, pdfPackage.path), function(err, result) {
            if (err) return console.log(`edit object package error ${err}`);
        
            console.log('pdf create succeed');
            response.status(200).json(pdfPackage.path)
        });
    },

}

