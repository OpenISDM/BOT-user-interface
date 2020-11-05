import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from './api/db/connection'
import mockData from './api_mockData';
const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { tw } from '../site_module/locale/text'
import encrypt from './api/service/encrypt'



async function get_object_id(request, response) {
    let { key, tag } = request.body;

    let matchRes = await match_key(key);

    if (matchRes == 1) {
        if (tag == "f4:2f:08:7a:71:66")
            response.json(mockData.ObjectID269);
        else
            response.json(error_code.mac_address_error);
    }
    else if (matchRes == 2) {
        response.json(error_code.key_timeout);
    }
    else {
        response.json(error_code.key_incorrect);
    }
}

const nullObject = [];
async function get_history_data(request, response) {
    let { key, object_id, Lbeacon_uuid, start_time, end_time, sort_type, count_limit } = request.body;

    let matchRes = await match_key(key);

    //console.log(count_limit);
    if (matchRes == 1) {
        if ((sort_type != "asc" && sort_type != "desc") && sort_type != undefined){
            response.json(error_code.sort_type_define_error);
            return;
        }

        if (object_id == 269 || object_id == undefined) {
            if ((Lbeacon_uuid != "00010018-0000-0001-1111-000000022222" && Lbeacon_uuid != undefined) || count_limit == 0) {
                response.json(nullObject);
            }
            else{
                response.json(mockData.get_history_record());
            }
        }
        else {
            response.json(nullObject);
        }
    }
    else if (matchRes == 2) {
        response.json(error_code.key_timeout);
    }
    else {
        response.json(error_code.key_incorrect);
    }
}
async function get_realtime_data(request, response) {
    let { key, object_id } = request.body;

    let matchRes = await match_key(key);

    if (matchRes == 1) {
        if (object_id == undefined || object_id == "269") {
            response.json(mockData.CurrentPosition269);
        }
        else {            
            response.json(nullObject);
        }
    }
    else if (matchRes == 2) {
        response.json(error_code.key_timeout);
    }
    else {
        response.json(error_code.key_incorrect);
    }
}

async function match_key(key) {
    let matchFlag = 0 // flag = 0 when key error
    return await pool
        .query(queryType.getAllKeyQuery)
        .then((res) => {
            res.rows.map((item) => {
                const vaildTime = moment(item.register_time).add(30, 'm')
                if (moment().isBefore(moment(vaildTime)) && item.key == key) {
                    matchFlag = 1 //in time & key right
                } else if (moment().isAfter(moment(vaildTime)) && item.key == key) {
                    matchFlag = 2 // out time & key right
                }
            })
            return matchFlag
        })
        .catch((err) => {
            console.log(`match key fails ${err}`)
        })
}

export default {
    get_history_data,
    get_object_id,
    get_realtime_data,
}