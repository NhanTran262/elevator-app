import {FaArrowDown, FaArrowUp, FaDoorClosed, FaDoorOpen} from "react-icons/fa";
import {PiElevatorThin} from "react-icons/pi";
import {useEffect, useState} from "react";
import {callElevator, selectFloor} from "@/service/elevatorAPI";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

export default function Elevator({floor, elevator}) {
    const [floorData, setFloorData] = useState(floor);
    const [isMovingUp, setIsMovingUp] = useState(elevator?.isMovingUp);
    const [currentFloor, setCurrentFloor] = useState(elevator?.currentFloor);
    const [targetFloor, setTargetFloor] = useState(null);
    const [elevatorId, setElevatorId] = useState(null);
    const [isDoorOpen, setIsDoorOpen] = useState(elevator?.isDoorOpen);
    const [isHolding, setIsHolding] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const router = useRouter();
    console.log(targetFloor);
    console.log(currentFloor);
    console.log(elevatorId);


    useEffect(() => {
        let doorTimer;
        if (!isHolding && isDoorOpen) {
            doorTimer = setTimeout(() => {
                setIsDoorOpen(false);
                toast.success(`Door of elevator ${elevator.id} is closed.`)
            }, 10000)
        }
        return () => {
            if (doorTimer) clearTimeout(doorTimer);
        }
    }, [isHolding, isDoorOpen, elevator.id]);

    const fetchCallElevator = async (request) => {
        const response = await callElevator(request)
        console.log(response)
        setElevatorId(response.data.id)
        setTargetFloor(response.data.targetFloor)
        setCurrentFloor(response.data.currentFloor)

    }

    const handleCallElevator = (direction) => {
        setCurrentFloor(null)
        const request = {
            targetFloor: floor.floorNumber,
            direction: direction,
        }
        console.log(request)
        fetchCallElevator(request).then()

    }

    const fetchSelectFloor = async (request) => {
        setCurrentFloor(null)
        const response = await selectFloor(request)
        console.log(response)
        setElevatorId(response.data.id)
        setTargetFloor(response.data.targetFloor)
        setCurrentFloor(response.data.currentFloor)
    }

    const handleSelectFloor = async () => {
        const request = {
            elevatorId: elevator.id,
            targetFloor: floor.floorNumber,
            direction: currentFloor < floor.floorNumber,
        }
        console.log(request)
        fetchSelectFloor(request).then()
    }

    const handleDoorOpen = () => {
        setIsDoorOpen(true);
        console.log(`Door of elevator ${elevator.id} is opened.`);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
        setTimeout(() => {
            toast.info(`The elevator ${elevator.id} will close in 10 seconds.`,);
        }, 1000)

    }

    const handleMouseDown = () => {
        setIsHolding(true);
        setIsDoorOpen(true);
        toast.success(`Door of elevator ${elevator.id} is opened.`)
    };

    const handleDoorClose = () => {
        setTimeout(() => {
            setIsDoorOpen(false);
            toast.success(`Door of elevator ${elevator.id} is closed.`)
        }, 1000)
    }


    return (
        <div className="panel">
            <div className="buttons-left">
                <button
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    style={{color: isDoorOpen || isHolding ? "red" : ""}}>
                    <FaDoorOpen className="icon"/>
                </button>
                <button disabled={!isDoorOpen}
                        onClick={handleDoorClose}>
                    <FaDoorClosed className="icon"/>
                </button>
            </div>
            <div className="floor">
                <button
                    onClick={handleSelectFloor}
                    style={{
                        color: currentFloor === floor.floorNumber ? 'red' : ''
                    }}>
                    {floor?.floorNumber}
                    <PiElevatorThin className="elevator-icon"/>
                </button>
            </div>
            <div className="buttons-right">
                <button type="button"
                        onClick={() => handleCallElevator(true)}>
                    <FaArrowUp className="icon"/>
                </button>
                <button type="button"
                        onClick={() => handleCallElevator(false)}>
                    <FaArrowDown className="icon"/>
                </button>
            </div>
        </div>
    )
}