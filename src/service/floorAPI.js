import {ELEVATOR_WEB_API} from "@/constant/appConstant";
import axios from "axios";

export async function getAllFloors() {
    let response = null
    await axios({
        url: `${ELEVATOR_WEB_API}/floors`,
        headers: {
            Accept: 'application/json'
        },
        method: 'GET',
    })
        .then((res) => {
            response = res
        })
        .catch((e) => {
            response = e.response
        })
    return response
}