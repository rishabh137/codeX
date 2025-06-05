import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const MeetingPage = () => {
    const { id } = useParams();
    const [codingStarted, setCodingStarted] = useState(false);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerInstance = useRef();

    useEffect(() => {
        const peer = new Peer();
        peerInstance.current = peer;

        peer.on("open", (peerId) => {
            console.log("My Peer ID:", peerId);

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play();
                }

                if (id && id !== peerId) {
                    const call = peer.call(id, stream);
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            remoteVideoRef.current.play();
                        }
                    });
                }

                peer.on("call", (incomingCall) => {
                    incomingCall.answer(stream);
                    incomingCall.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            remoteVideoRef.current.play();
                        }
                    });
                });
            });
        });

        return () => {
            peer.destroy();
        };
    }, [id]);

    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-end">
                <button
                    className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition"
                    onClick={() => setCodingStarted(true)}
                >
                    Start Coding
                </button>
            </div>

            <div className="flex flex-1">
                <div className={`${codingStarted ? "w-1/2" : "w-full"} bg-black flex items-center justify-center flex-col`}>
                    <div className={`${codingStarted ? "flex-coll" : ""}flex gap-4`}>
                        <video ref={localVideoRef} className="w-64 h-48 bg-gray-800" playsInline muted></video>
                        <video ref={remoteVideoRef} className="w-64 h-48 bg-gray-800" playsInline></video>
                    </div>
                </div>

                {codingStarted && (
                    <div className="w-1/2">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            defaultLanguage="javascript"
                            defaultValue="// Start coding here..."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingPage;
