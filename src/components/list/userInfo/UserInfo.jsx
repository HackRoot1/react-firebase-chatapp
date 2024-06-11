import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css";
import React from "react";

const UserInfo = () => {
    const { currentUser } = useUserStore();
    const { isStyle1, isStyle2, isStyle3, changeStyle, changeStyle2, changeStyle3} = useChatStore();

    const handleSetting = () => {
        changeStyle(isStyle1)
        changeStyle3(isStyle3)
    }
    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" onClick={handleSetting} />
                <img src="./video.png" alt="" />
                <img src="./edit.png" alt="" />
            </div>
        </div>
    );
};

export default UserInfo;
