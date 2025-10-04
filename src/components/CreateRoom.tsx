import { useContext } from "react"
import { SocketContext } from "../Context/socket.context"

const CreateRoom: React.FC = () => {
    const {socket}  = useContext(SocketContext)
    const initRoom = () => {
        console.log("Creating a new room");
        socket.emit("create-room")
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={initRoom}>
            Start a new meeting in a new room
        </button>
    )
}

export default CreateRoom