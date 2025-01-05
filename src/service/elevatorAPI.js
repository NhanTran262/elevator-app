import {ELEVATOR_WEB_API} from "@/constant/appConstant";
import axios from "axios";

export async function getAllElevator() {
    let response = null
    await axios({
        url: `${ELEVATOR_WEB_API}/elevators`,
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

export async function callElevator(request) {
    let response = null
    await axios({
        url: `${ELEVATOR_WEB_API}/elevators/call`,
        headers: {
            Accept: 'application/json'
        },
        method: 'POST',
        data: request
    })
        .then((res) => {
            response = res
        })
        .catch((e) => {
            response = e.response
        })
    return response
}
export async function selectFloor(request) {
    let response = null
    await axios({
        url: `${ELEVATOR_WEB_API}/elevators/select`,
        headers: {
            Accept: 'application/json'
        },
        method: 'POST',
        data: request
    })
        .then((res) => {
            response = res
        })
        .catch((e) => {
            response = e.response
        })
    return response
}