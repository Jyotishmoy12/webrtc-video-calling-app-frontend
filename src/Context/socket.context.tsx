import SocketIoClient from "socket.io-client";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`)
    }
    socket.on("room-created", enterRoom); // listening to the room-created event from the server and calling the enterRoom function when the event is emitted
  }, [])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
