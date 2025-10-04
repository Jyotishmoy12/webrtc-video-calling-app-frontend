import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import { v4 as uuidv4 } from "uuid"

const WS_server = "http://localhost:3000";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null)

const socket = SocketIoClient(WS_server, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

interface Props {
  children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {

  const navigate = useNavigate();

  // state variable to store the userId
  const [user, setUser] = useState<Peer>(); // new Peer user

  useEffect(() => {
    const userId = uuidv4()
    const newPeer = new Peer(userId)
    setUser(newPeer)
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`)
    }
    socket.on("room-created", enterRoom); // listening to the room-created event from the server and calling the enterRoom function when the event is emitted
  }, [])
  return (
    <SocketContext.Provider value={{socket, user}}>
      {children}
    </SocketContext.Provider>
  );
};
