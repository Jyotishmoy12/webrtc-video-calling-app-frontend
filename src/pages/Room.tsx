import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/socket.context";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {
    const { id } = useParams()
    const { socket, user, stream } = useContext(SocketContext)

    useEffect(() => {
        // emiting this event so that either creator of the room or joinee in the room
        // the server knows the new people have been added to the room
        if (user) {
            socket.emit("joined-room", { roomId: id, peerId: user.id })
        }
    }, [id, user, socket])

    return (
        <div className="h-[100vh] flex items-center justify-center">
            Room: {id}
            <UserFeedPlayer stream={stream} />
        </div>
    );
}

export default Room