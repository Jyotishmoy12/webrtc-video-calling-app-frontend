import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/socket.context";

const Room: React.FC = () => {
    const { id } = useParams()
    const socket = useContext(SocketContext)

    useEffect(() => {
        // emiting this event so that either creator of the room or joinee in the room
        // the server knows the new people have been added to the room
        socket.emit("joined-room", { roomId: id })
    }, []) 

    return (
        <div className="h-[100vh] flex items-center justify-center">
            Room: {id}
        </div>
    );
}

export default Room