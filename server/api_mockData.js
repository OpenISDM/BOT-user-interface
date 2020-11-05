
import moment from 'moment-timezone';
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss';

const ObjectID269 = {
    object_id: 269,
    object_name: "T05-166",
    tag: "f4:2f:08:7a:71:66"
};
const CurrentPosition269 =
{
    object_id: 269,
    object_name: "T05-166",
    area_id: "1",
    area_name: "護理之家",
    Lbeacon_uuid: "00010018-0000-0001-1111-000000022222",
    Lbeacon_description: "大廳",
    payload: "02010612FF107803E800000000006200001B00000000080954303520313636"
};

function get_history_record() {
    return {
        object_id: 269,
        name: "T05-166",
        area_id: "1",
        area_name: "護理之家",
        Lbeacon_uuid: "00010018-0000-0001-1111-000000022222",
        Lbeacon_description: "大廳",
        start_time: moment().format(timeDefaultFormat),
        end_time: moment(moment().subtract(1, 'day')).format(timeDefaultFormat),
        duration: {
            hours: 24,
            minutes: 2,
            seconds: 7,
            milliseconds: 1111
        },
        payload: "02010612FF107803E800000000006200001B00000000080954303520313636"
    }
}

export default {
    ObjectID269,
    CurrentPosition269,
    get_history_record,
};