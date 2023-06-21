import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/:userName" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import "./App.css";
// import ChatPage from "./pages/ChatPage";
// import LoginPage from "./pages/LoginPage";
// import React, { useState } from "react";

// enum Page {
//   LOGIN,
//   CHAT,
// }

// function App() {
//   const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
//   const [username, setUsername] = useState<string>("");

//   const handleJoinChat = (username: string) => {
//     setUsername(username);
//     setCurrentPage(Page.CHAT);
//   };

//   return (
//     <div className="App">
//       {currentPage === Page.LOGIN && <LoginPage onJoinChat={handleJoinChat} />}
//       {currentPage === Page.CHAT && <ChatPage username={username} />}
//     </div>
//   );
// }
// export default App;
