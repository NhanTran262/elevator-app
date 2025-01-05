"use client"
import "../css/elevator.css"
import Elevator from "@/components/Elevator";
import {useEffect, useState} from "react";
import {getAllFloors} from "@/service/floorAPI";
import {getAllElevator} from "@/service/elevatorAPI";

export default function Home() {
    const [elevators, setElevators] = useState([])
    const [floors, setFloors] = useState([])
    console.log(floors)
    console.log(elevators)

    useEffect(() => {
        const fetchData = async () => {
            const [elevatorData, floorData] = await Promise.all([
                getAllElevator(),
                getAllFloors()
            ])
            setElevators(elevatorData.data)
            setFloors(floorData.data.reverse())
        }
        fetchData().then()
    }, [])
    return (
        <div className="container">
            {elevators?.map((elevator,index) => (
                <div key={index} className="elevator">
                    {floors?.map(floor => (
                        <Elevator key={floor.id} floor={floor} elevator={elevator}/>))}
                </div>))}
        </div>
    );
}
