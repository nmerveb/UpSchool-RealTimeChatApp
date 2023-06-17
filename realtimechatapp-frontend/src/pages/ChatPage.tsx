import React, { ChangeEvent, useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

type Message = {
  username: string;
  content: string;
  createdOn: Date;
};

const ChatPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<Message>({
    username: "",
    content: "",
    createdOn: new Date(),
  });
  const [userList, setUserList] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    let connection: HubConnection | null = null;

    const startConnection = async () => {
      connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7163/userhub")
        .withAutomaticReconnect()
        .build();

      connection.on("UserListUpdated", (users: string[]) => {
        setUserList(users);
      });

      connection.on("MessageAdded", (message: Message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
      });

      try {
        await connection.start();
        console.log("SignalR bağlantısı başlatıldı.");
        getUserList(connection); // Kullanıcı listesini başlatma
      } catch (err: any) {
        console.error(err.toString());
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7163/userhub")
      .build();

    getUpdatedMessageList(connection); // Mesaj listesini al

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const getUserList = (connection: HubConnection) => {
    connection
      .invoke("getUserList")
      .then((users: string[]) => {
        setUserList(users);
      })
      .catch((err) => console.error(err.toString()));
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleJoinChat = () => {
    if (username.trim() === "") {
      alert("Lütfen geçerli bir kullanıcı adı girin.");
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7163/userhub")
      .build();

    connection
      .start()
      .then(() => {
        connection
          .invoke("addUser", username)
          .then(() => {
            console.log("Kullanıcı eklendi:", username);
            getUserList(connection); // Kullanıcı listesini güncelleme
          })
          .catch((err) => console.error(err.toString()));
      })
      .catch((err) => console.error(err.toString()));
  };

  const handleSendMessage = () => {
    if (message.content.trim() === "") {
      alert("Lütfen geçerli bir mesaj girin.");
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7163/userhub")
      .build();

    connection
      .start()
      .then(() => {
        connection
          .invoke("addMessage", {
            username: username,
            content: message.content,
            createdOn: new Date(),
          })
          .then(() => {
            console.log("Mesaj gönderildi:", message.content);
            setMessage({ username: "", content: "", createdOn: new Date() });
          })
          .catch((err) => console.error(err.toString()));
      })
      .catch((err) => console.error(err.toString()));
  };

  const getUpdatedMessageList = (connection: HubConnection) => {
    connection
      .invoke("getUpdatedMessageList")
      .then((messages: Message[]) => {
        setChatMessages(messages);
      })
      .catch((err) => console.error(err.toString()));
  };

  return (
    <div>
      <h1>Chat Uygulaması</h1>
      <div>
        <label>Kullanıcı Adı:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <button onClick={handleJoinChat}>Katıl</button>
      </div>
      <div>
        <h2>Aktif Kullanıcılar:</h2>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Mesajlar:</h2>
        <ul>
          {chatMessages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>Mesaj:</label>
        <input
          type="text"
          value={message.content}
          onChange={(e) =>
            setMessage({
              ...message,
              content: e.target.value,
              createdOn: new Date(),
            })
          }
        />
        <button onClick={handleSendMessage}>Gönder</button>
      </div>
    </div>
  );
};

export default ChatPage;
