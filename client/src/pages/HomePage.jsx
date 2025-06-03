import { useState } from "react";
import toast from "react-hot-toast";

import Header from "../components/Header";

import Xconstant from "../constant/Xconstant";

const HomePage = () => {
    const [open, setOpen] = useState(false);
    const [meetLink, setMeetLink] = useState('');

    const generateMeetLink = () => {
        const meetLink = Xconstant.baseUrl + crypto.randomUUID();
        setMeetLink(meetLink);
    }

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(meetLink);
        toast.success('Copied!');
    }

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
                    Real-time collaborative <span className="text-cyan-400">code editing</span> and meetings
                </h1>
                <p className="mb-8 text-center max-w-lg text-gray-700 dark:text-gray-300">
                    Connect instantly with teammates to write, edit, and debug code together - seamless collaboration anywhere.
                </p>

                <div className="relative inline-block text-left">
                    <button
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
                        onClick={() => setOpen(true)}
                    >
                        New Meeting
                    </button>

                    {open && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white dark:bg-[#2c2c2c] rounded-xl shadow-lg w-100 p-6 text-center">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">New Meeting</h2>
                                <ul className="space-y-4">
                                    {
                                        !meetLink ?
                                            <li
                                                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                                onClick={generateMeetLink}
                                            >
                                                <i className="fa-solid fa-link text-cyan-500"></i>
                                                <span className="text-gray-800 dark:text-white">Create a meeting for later</span>
                                            </li>
                                            :
                                            <li
                                                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                            >
                                                <span className="text-gray-800 dark:text-white text text-sm">{meetLink}</span>
                                                <i class="fa-regular fa-copy text-cyan-500 cursor-pointer p-2 hover:bg-gray-300 hover:rounded-md transition"
                                                    onClick={copyToClipBoard}
                                                ></i>
                                            </li>
                                    }
                                    <li
                                        className="flex items-center gap-3 p-3 rounded-md bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    >
                                        <i className="fa-solid fa-plus text-cyan-500"></i>
                                        <span className="text-gray-800 dark:text-white">Start an instant meeting</span>
                                    </li>
                                </ul>
                                <button
                                    className="mt-6 px-4 py-2 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    onClick={() => {
                                        setOpen(false);
                                        setMeetLink('')
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePage;