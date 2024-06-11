import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";
import React from "react";

const Detail = () => {
    const {
        chatId,
        user,
        isCurrentUserBlocked,
        isReceiverBlocked,
        changeBlock,
        resetChat,
        isStyle2,
        isStyle3,
        changeStyle2,
        changeStyle3,
    } = useChatStore();

    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked
                    ? arrayRemove(user.id)
                    : arrayUnion(user.id),
            });

            changeBlock();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetting = () => {
        changeStyle2(isStyle2)
        changeStyle3(isStyle3)
    }
    

    const handleLogout = () => {
        auth.signOut();
        resetChat();
    };



    return (
        <div className="detail">
            <div className="back-btn">
                <img src="./arrowUp.png" alt="" onClick={handleSetting} />
            </div>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.userename}</h2>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./avatar.png" alt="" />
                                <span>abc_2024.png</span>
                            </div>
                            <img src="./download.png" className="icon" alt="" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="btns">
                    <button onClick={handleBlock}>
                        {isCurrentUserBlocked
                            ? "You are Blocked"
                            : isReceiverBlocked
                            ? "User Blocked"
                            : "Block User"}
                    </button>
                    <button className="logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
