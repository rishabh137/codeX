import { useState, useRef, useEffect, useContext } from "react";
import Peer from "peerjs";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, CameraOff, Mic, MicOff, Phone } from 'lucide-react';
import { CodeContext } from "../contexts/CodeContext";
import CodePage from "./CodePage";
import Loader from "../components/Loader";

const MeetingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { codingStarted } = useContext(CodeContext);
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
        <div className="flex flex-col">
            {!stream && (
                <div className={`${codingStarted ? "w-1/2" : "w-full"} absolute inset-0 flex items-center justify-center bg-opacity-80 rounded`}>
                    <Loader />
                </div>
            )}
            <div className="flex flex-1">
                <div className={`${codingStarted ? "w-1/2" : "w-full"} flex flex-col items-center justify-center`}>
                    <div className={`${codingStarted ? "flex-col-reverse" : ""} flex gap-4 mb-4 mt-5`}>
                        <video
                            ref={localVideoRef}
                            className={`${codingStarted ? "h-96" : "h-auto"} w-full rounded`}
                            playsInline
                            muted
                        ></video>
                        {/* {remoteConnected && ( */}
                        <video
                            ref={remoteVideoRef}
                            className={`${codingStarted ? "h-96 bg-gray-800" : "h-auto"}  rounded`}
                            playsInline
                        ></video>
                        {/* )} */}
                    </div>
                    {stream && (

                        <div className="p-4 dark:bg-gray-800 flex gap-2 justify-end">
                            <button
                                onClick={toggleCamera}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                            >
                                {cameraOn ? <Camera className="w-8 h-8" /> : <CameraOff className="w-8 h-8" />}
                            </button>
                            <button
                                onClick={toggleMic}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                            >
                                {micOn ? <Mic className="w-8 h-8 text-white" /> : <MicOff className="w-8 h-8 text-white" />}
                            </button>
                            <button
                                onClick={endCall}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                            >
                                <Phone className="w-8 h-8 text-green-500" />
                            </button>
                        </div>
                    )}
                </div>

                {codingStarted && (
                    <CodePage />
                )}
            </div>
        </div>
    );
};

export default MeetingPage;
