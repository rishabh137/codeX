import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';

const MeetingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [codingStarted, setCodingStarted] = useState(false);
    const [stream, setStream] = useState(null);
    const [remoteConnected, setRemoteConnected] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const currentCall = useRef(null);

    useEffect(() => {
        const peer = new Peer();
        peerInstance.current = peer;

        peer.on("open", (peerId) => {
            console.log("My Peer ID:", peerId);

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((userStream) => {
                setStream(userStream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = userStream;
                    localVideoRef.current.play();
                }

                if (id && id !== peerId) {
                    const call = peer.call(id, userStream);
                    currentCall.current = call;

                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            remoteVideoRef.current.play();
                            setRemoteConnected(true);
                        }
                    });
                }

                peer.on("call", (incomingCall) => {
                    incomingCall.answer(userStream);
                    currentCall.current = incomingCall;

                    incomingCall.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            remoteVideoRef.current.play();
                            setRemoteConnected(true);
                        }
                    });
                });
            });
        });

        return () => {
            peer.destroy();
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [id]);

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
            setCameraOn((prev) => !prev);
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
            setMicOn((prev) => !prev);
        }
    };

    const endCall = () => {
        currentCall.current?.close();
        stream?.getTracks().forEach((track) => track.stop());
        navigate("/");
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-1">
                <div className={`${codingStarted ? "w-1/2" : "w-full"} flex flex-col items-center justify-center`}>
                    <div className="flex gap-4 mb-4">
                        <video
                            ref={localVideoRef}
                            className="w-full h-auto rounded"
                            playsInline
                            muted
                        ></video>
                        {remoteConnected && (
                            <video
                                ref={remoteVideoRef}
                                className="w-full h-auto bg-gray-800 rounded"
                                playsInline
                            ></video>
                        )}
                    </div>
                    <div className="p-4 dark:bg-gray-800 flex gap-2 justify-end">
                        <button
                            onClick={toggleCamera}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                        >
                            {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleMic}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                        >
                            {micOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
                        </button>
                        <button
                            onClick={endCall}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                        >
                            <Phone className="w-6 h-6 text-green-500" />
                        </button>
                        <button
                            onClick={() => setCodingStarted(true)}
                            className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 cursor-pointer"
                        >
                            Start Coding
                        </button>
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
