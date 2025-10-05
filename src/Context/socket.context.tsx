import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import { v4 as uuidv4 } from "uuid"
import { peerReducer } from "../reducers/peerReducer";
import { addPeerAction } from "../actions/peerAction";

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
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setStream(stream)
  }

  const fetchParticipantsList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
    console.log("fetched room participants")
    console.log(roomId, participants)
  }

  useEffect(() => {
    const userId = uuidv4()
    const newPeer = new Peer(userId, {
      host: "localhost",
      port: 9000,
      path: "/myapp"
    })
    setUser(newPeer)
    fetchUserFeed()
    const enterRoom = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`)
    }
    socket.on("room-created", enterRoom); // listening to the room-created event from the server and calling the enterRoom function when the event is emitted

    socket.on("get-users", fetchParticipantsList) // listening to the get-users event from the server and calling the fetchParticipantsList function when the event is emitted
  }, [])

  useEffect(() => {
    if (!user && !stream) return;
    socket.on("user-joined", ({ peerId }) => {
      if (stream) {
        const call = user?.call(peerId, stream);
        console.log("calling the new peer", peerId)
        call?.on("stream", () => {
          dispatch(addPeerAction(peerId, stream))
        })
      }
    })
    user?.on("call", (call) => {
      // what to do when a call is received from a peer
      console.log("Received a call from a peer");
      call.answer(stream);
      if(stream)
      call.on("stream", () => {
        dispatch(addPeerAction(call.peer, stream))
      })
    })
    socket.emit("ready")
  }, [user, stream])
  return (
    <SocketContext.Provider value={{ socket, user, stream, peers}}>
      {children}
    </SocketContext.Provider>
  );
};
