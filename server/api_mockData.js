
import moment from 'moment-timezone';
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss';

const ObjectID269 = {
    object_id: 269,
    object_name: "T05-166",
    tag: "f4:2f:08:7a:71:66"
};

const ObjectID270 = {
    object_id : 270,
    object_name : "",
    tag:""
};

const CurrentPosition269 =
{
    object_id: 269,
    object_name: "T05-166",
    mac_address :"f4:2f:08:7a:71:66",
    area_id: "1",
    area_name: "護理之家",
    Lbeacon_uuid: "00010018-0000-0001-1111-000000022222",
    Lbeacon_description: "大廳",
    payload: "02010612FF107803E800000000006200001B00000000080954303520313636"
};

const CurrentPosition270 = {
    object_id:270,
    object_name : "T05-E0F",
    mac_address : "ec:41:e0:78:5e:0f",
    area_id : "1",
    area_name : "護理之家",
    Lbeacon_uuid:"00010017-0000-0001-6000-000000010000",
    Lbeacon_description:"櫃台",
    payload: "02010612FF107803E87C510000006200004D00000000080954303520453046"
};

function generate_history_record(start_time, end_time, limit_count, sort_type){    
    let data=[];

    if(end_time == undefined)
        end_time = moment().add(-1,'days');
    else
        end_time = moment(end_time);
    if(start_time == undefined)
        start_time = moment();
    else
        start_time = moment(start_time);

    if(limit_count == undefined)
        limit_count = 10;
    if(sort_type == 'desc')
    {
        let start_tmp = start_time;
        for(let i=0;i<limit_count/2;i++){
            if(start_tmp.isAfter(moment(end_time)))
                break;

            data.push(get_history_record_(start_tmp));
            data.push(get_history_record(start_tmp));
            start_tmp = start_tmp.add(-5,'s');            
        }
    }
    else if(sort_type == 'asc')
    {
        let end_tmp = end_time;
        for(let i=0;i<limit_count/2;i++){
            if(end_tmp.isBefore(moment(start_time)))
                break;

            data.push(get_history_record_(end_tmp));
            data.push(get_history_record(end_tmp));
            end_tmp= end_tmp.add(5,'s');            
        }
    }

    return data;
}

function get_history_record_(timestamp){
    return{
        object_id:270,
        name:"T05-E0F",
        mac_address:"ec:41:e0:78:5e:0f",
        area_id:"1",
        area_name:"護理之家",
        Lbeacon_uuid:"00010017-0000-0001-6000-000000010000",
        Lbeacon_description:"大廳",
        record_timestamp: timestamp.format(timeDefaultFormat),
        payload:"02010612FF107803E87C510000006200004D00000000080954303520453046"
    };
}

function get_history_record(timestamp){
    return {
        object_id: 269,
        name: "T05-166",
        mac_address : "f4:2f:08:7a:71:66",
        area_id: "1",
        area_name: "護理之家",
        Lbeacon_uuid: "00010018-0000-0001-1111-000000022222",
        Lbeacon_description: "大廳",
        record_timestamp : timestamp.format(timeDefaultFormat),
        payload: "02010612FF107803E800000000006200001B00000000080954303520313636"
    };
}

export default {
    CurrentPosition269,
    CurrentPosition270,
    get_history_record,
        generate_history_record
};