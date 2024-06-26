import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({ file: null, url: "" });

    // console.log(chat?.messages[0].text);
    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, isStyle1, isStyle2, isStyle3, changeStyle, changeStyle2, changeStyle3 } =
        useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleEmoji = (e) => {
        setText((pre) => pre + e.emoji);
        setOpen(false);
    };

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleChatView = () => {
        changeStyle(isStyle1)
        changeStyle2(isStyle2)
    }

    const handleSetting = () => {
        changeStyle2(isStyle2)
        changeStyle3(isStyle3)
    }

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatSnapshot = await getDoc(userChatsRef);

                if (userChatSnapshot.exists()) {
                    const userChatsData = userChatSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            setImg({
                file: null,
                url: "",
            });

            setText("");
        }
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./arrowUp.png" alt="" className="back-btn" onClick={handleChatView} />
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>

                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" onClick={handleSetting} />
                </div>
            </div>

            <div className="center">
                {chat?.messages?.map((message) => (
                    <div
                        className={
                            message?.senderId === currentUser?.id
                                ? "message own"
                                : "message"
                        }
                        key={(message.createdAt.toDate()).getTime()}
                    >
                        <div className="texts">
                            {message?.img && <img src={message.img} alt="" />}
                            <p>{message?.text}</p>
                            <span>{format(message?.createdAt.toDate())}</span>
                        </div>
                    </div>
                ))}

                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}

                <div ref={endRef}></div>
            </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImg}
                    />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={
                        isCurrentUserBlocked || isReceiverBlocked
                            ? "You cannot send a message"
                            : "Type a message..."
                    }
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => setOpen((pre) => !pre)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button
                    className="sendButton"
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
