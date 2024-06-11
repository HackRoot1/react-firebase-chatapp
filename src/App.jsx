import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId, isStyle1, isStyle2, isStyle3 } = useChatStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid);
        });
        return () => {
            unSub();
        };
    }, [fetchUserInfo, onAuthStateChanged]);

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            {currentUser ? (
                <>
                    {isStyle1 && <List />}
                    {isStyle2 && chatId && <Chat />}
                    {isStyle3 && chatId && <Detail />}
                </>
            ) : (
                <Login />
            )}

            <Notification />
        </div>
    );
};

export default App;
