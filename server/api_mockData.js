
import moment from 'moment-timezone';
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss';

const ObjectID269={
    object_id : 269,
    object_name : "T05-166",
    tag : "f4:2f:08:7a:71:66"
};
const CurrentPosition269 = 
{
    object_id : 269,
    object_name : "T05-166",
    area_id : "1",
    area_name : "護理之家",
    Lbeacon_uuid : "00010018-0000-0001-1111-000000022222",
    Lbeacon_description : "大廳",
    payload : "02010612FF107803E800000000006200001B00000000080954303520313636"
};



function get_history_record(StartTime, EndTime){
    if(StartTime ==undefined){
        StartTime = moment(moment().subtract(1, 'day')).format();
    }else{
        StartTime = moment(StartTime, timeDefaultFormat);
    }
    if(EndTime == undefined || moment(EndTime, timeDefaultFormat, true).isValid() == false){
        EndTime = moment.now();
    }else{
        EndTime = moment(EndTime, timeDefaultFormat);
    }
    //let diff = moment(EndTime).diff(moment.StartTime);
    let different =  moment.duration(moment(EndTime, timeDefaultFormat).diff(moment(StartTime, timeDefaultFormat)));

    return {
        object_id : 269,
        name : "T05-166",
        area_id : "1",
        area_name : "護理之家",
        Lbeacon_uuid : "00010018-0000-0001-1111-000000022222",
        Lbeacon_description : "大廳",
        start_time : StartTime,
        end_time : EndTime,
        duration : { 
            hours : different.format("HH"),
            minutes : different.format("mm"),
            seconds : different.format("ss"),
            milliseconds : different.format("x")
        },
        payload : "02010612FF107803E800000000006200001B00000000080954303520313636"
    }
}

export default {
    ObjectID269,
    CurrentPosition269,
    get_history_record
};