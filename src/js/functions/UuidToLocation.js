export default function UuidToLocation(lbeacon_uuid){
        /** Example of lbeacon_uuid: 00000018-0000-0000-7310-000000004610 */
        try{
        	const zz = lbeacon_uuid.slice(6,8);
		    const xx = parseInt(lbeacon_uuid.slice(14,18) + lbeacon_uuid.slice(19,23));
		    const yy = parseInt(lbeacon_uuid.slice(-8));
		    return [yy, xx];
        }catch{
        	return null
        }
	    
}