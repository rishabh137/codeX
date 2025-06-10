import { useEffect, useState } from "react";

import Xconstant from "../constant/Xconstant";

import HomeContent from "../components/HomeContent";
import HomeButton from "../components/HomeButton";
import MeetingModal from "../components/MeetingModal";

const HomePage = () => {
    const baseUrl = Xconstant.baseUrl
    const [openMeetLinkModal, setOpenMeetLinkModal] = useState(false);
    const [showlaterMeetLink, setShowLaterMeetLink] = useState(false);
    const [meetLink, setMeetLink] = useState('');

    useEffect(() => {
        const meetLink = baseUrl + 'meeting/' + crypto.randomUUID();
        setMeetLink(meetLink);
    }, [])

    return (
        <>
            <div className="h-190 flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6">
                <HomeContent />

                <div className="relative inline-block text-left">
                    <HomeButton setOpenMeetLinkModal={setOpenMeetLinkModal} />

                    {openMeetLinkModal && (
                        <MeetingModal
                            showlaterMeetLink={showlaterMeetLink}
                            setShowLaterMeetLink={setShowLaterMeetLink}
                            meetLink={meetLink}
                            setMeetLink={setMeetLink}
                            setOpenMeetLinkModal={setOpenMeetLinkModal}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePage;