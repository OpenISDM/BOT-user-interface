import error_code from './api_error_code'
import moment from 'moment-timezone'
import queryType from './api_queryType'
import pool from './api/db/connection'

const timeDefaultFormat = 'YYYY/MM/DD HH:mm:ss'
import { tw } from '../site_module/locale/text'
import encrypt from './api/service/encrypt'

async function get_realtime_people_data(request, response){
    let{
        key
    } = request.body;

    switch (?){
        case AuthValid.correct:{
            
            break;
        }
        case AuthValid.incorrect:{
            response.json(error_code.incorrect);
            break;
        }
        case AuthValid.invalid:{
            response.json(error_code.invalid);
            break;
        }
    }
}

async function get_history_people_data(request, response){
    let{
        key,
        start_time,
        end_time,
        sort_type,
        count_limit       
    } = request.body;

    switch (?){
        case AuthValid.correct:{
            break;
        }
        case AuthValid.incorrect:{
            response.json(error_code.incorrect);
            break;
        }
        case AuthValid.invalid:{
            response.json(error_code.invalid);
            break;
        }
    }

}

// async function CheckAuthication(key){
//     return await pool
//     .query(queryType)
//     .then((res)=>{
//         res.row.map((item)=>{

//         }

//         return
//     })
//     .catch((err)=>{
//         console.error(`match key fails ${err}`);
//     });


// }

enum AuthValid {
    incorrect = 0,
    correct,
    invalid
}