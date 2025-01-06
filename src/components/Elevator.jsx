import {FaArrowDown, FaArrowUp, FaDoorClosed, FaDoorOpen} from "react-icons/fa";
import {PiElevatorThin} from "react-icons/pi";
import {useEffect, useState} from "react";
import {callElevator, getAllElevator, selectFloor} from "@/service/elevatorAPI";
import {toast} from "react-toastify";

export default function Elevator({floor, elevator}) {
    const [currentFloor, setCurrentFloor] = useState(elevator.currentFloor);
    const [targetFloor, setTargetFloor] = useState(null);
    const [elevatorId, setElevatorId] = useState(null);
    const [elevatorCurrentId, setElevatorCurrentId] = useState(null);
    const [isDoorOpen, setIsDoorOpen] = useState(elevator?.isDoorOpen);
    const [isHolding, setIsHolding] = useState(false)

    const fetchElevators = async () => {
        const elevators = await getAllElevator();
        const elevatorData = elevators.data?.find(elevator => elevator.id === elevatorId);
        const distance = targetFloor - elevatorData.currentFloor;
        const direction = distance > 0;


        const moveElevator = async () => {
            let currentPosition = currentFloor;
            while (currentPosition !== targetFloor) {
                if (currentPosition < targetFloor) {
                    currentPosition++;
                } else {
                    currentPosition--;
                }
                await new Promise(resolve => {
                    setTimeout(() => {
                        setCurrentFloor(floor);
                        toast.info(`Elevator ${elevatorId} to floor ${currentPosition}`);
                        resolve();
                    }, 1000);
                });
            }

            if (elevatorId === elevatorCurrentId) {
                setIsDoorOpen(true);
                toast.success(`Elevator ${elevatorCurrentId} arrived at floor ${targetFloor}`);
            }
            setTargetFloor(null);
            setTimeout(() => {
                window.location.reload();
            }, 8000);
        };
        moveElevator().then();
    };

    useEffect(() => {
        if (targetFloor !== null && elevatorId === elevatorCurrentId) {
            fetchElevators().then();
        }
    }, [targetFloor, elevatorId, elevatorCurrentId]);

    useEffect(() => {
        let doorTimer;
        if (!isHolding && isDoorOpen) {
            doorTimer = setTimeout(() => {
                setIsDoorOpen(false);
                toast.success(`Door of elevator ${elevatorId ? elevatorId : elevator.id} is closed.`)
            }, 5000)
        }
        return () => {
            if (doorTimer) clearTimeout(doorTimer);
        }
    }, [isHolding, isDoorOpen, elevator.id]);

    const fetchCallElevator = async (request) => {
        const response = await callElevator(request)
        setElevatorId(response.data.id)
        setElevatorCurrentId(response.data.id)
        setTargetFloor(response.data.targetFloor)

    }

    const handleCallElevator = (direction) => {
        const request = {
            elevatorId: elevator.id,
            targetFloor: floor.floorNumber,
            direction: direction,
        }
        fetchCallElevator(request).then()

    }

    const fetchSelectFloor = async (request) => {
        const response = await selectFloor(request)
        setElevatorId(response.data.id)
        setElevatorCurrentId(response.data.id)
        setTargetFloor(response.data.targetFloor)
    }

    const handleSelectFloor = async () => {
        const request = {
            elevatorId: elevator.id,
            targetFloor: floor.floorNumber,
            direction: currentFloor < floor.floorNumber,
        }
        fetchSelectFloor(request).then()
    }

    const handleMouseUp = () => {
        setIsHolding(false);
        setTimeout(() => {
            toast.info(`The elevator ${elevator.id} will close in 5 seconds.`,);
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
                        color: currentFloor === floor.floorNumber ? '#f44336' : ''
                        || currentFloor === floor.floorNumber && elevatorId === elevatorCurrentId ? '#f44336' : ''
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