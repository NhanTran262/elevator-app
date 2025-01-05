import {FaArrowDown, FaArrowUp, FaDoorClosed, FaDoorOpen} from "react-icons/fa";
import {PiElevatorThin} from "react-icons/pi";
import {useEffect, useState} from "react";
import {callElevator, getAllElevator, selectFloor} from "@/service/elevatorAPI";
import {toast} from "react-toastify";

export default function Elevator({floor, elevator}) {
    const [floorData, setFloorData] = useState(floor);
    const [isMovingUp, setIsMovingUp] = useState(elevator?.isMovingUp);
    const [currentFloor, setCurrentFloor] = useState(elevator.currentFloor);
    const [targetFloor, setTargetFloor] = useState(null);
    const [elevatorId, setElevatorId] = useState(null);
    const [elevatorCurrentId, setElevatorCurrentId] = useState(null);
    const [isDoorOpen, setIsDoorOpen] = useState(elevator?.isDoorOpen);
    const [isHolding, setIsHolding] = useState(false)
    const [isMoving, setIsMoving] = useState(false)

    console.log(targetFloor);
    console.log(currentFloor);
    console.log(elevatorId);
    console.log(elevatorCurrentId);
    const fetchElevators = async () => {
        const elevators = await getAllElevator();
        const elevatorData = elevators.data?.find(elevator => elevator.id === elevatorId);

        // Tính khoảng cách và hướng di chuyển
        const distance = targetFloor - elevatorData.currentFloor;
        const direction = distance > 0;
        setIsMovingUp(direction);

        // Tạo animation di chuyển
        const moveElevator = async () => {
            let currentPosition = elevatorData.currentFloor;

            const moveOneFloor = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (direction) {
                            currentPosition++;
                        } else {
                            currentPosition--;
                        }
                        setCurrentFloor(currentPosition);
                        resolve();
                        toast.info(`Elevator ${elevatorId} to floor ${currentPosition}`);
                    }, 2000);
                });
            };

            // Di chuyển qua từng tầng cho đến khi đến targetFloor
            while (direction ? currentPosition < targetFloor : currentPosition > targetFloor) {
                await moveOneFloor();
            }

            // Khi đến nơi
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
        console.log(response)
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
        console.log(request)
        fetchCallElevator(request).then()

    }

    const fetchSelectFloor = async (request) => {
        const response = await selectFloor(request)
        console.log(response)
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