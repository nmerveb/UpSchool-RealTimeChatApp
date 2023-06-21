import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useParams } from "react-router-dom";

type Message = {
  username: string;
  content: string;
  createdOn: Date;
};

const ChatPage: React.FC = () => {
  const { userName } = useParams<{ userName: string }>();

  const [message, setMessage] = useState<Message>({
    username: userName || "",
    content: "",
    createdOn: new Date(),
  });
  const [userList, setUserList] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7163/userhub")
      .build();

    newConnection.start().then(() => {
      newConnection.invoke("GetUserList").then((users) => {
        setUserList([...users]);

        if (userName && users.includes(userName)) {
          console.log("Kullanıcı zaten eklenmiş:", userName);
        } else if (userName) {
          newConnection.invoke("addUser", userName).then(() => {
            console.log("Kullanıcı eklendi:", userName);
          });
        }
      });
    });

    newConnection.on("UserAdded", (user: string) => {
      setUserList((prevUserList) => [...prevUserList, user]);
      console.log("Kullanıcı eklendi:", user);
    });

    newConnection.on("UserRemoved", (user: string) => {
      setUserList((prevUserList) => prevUserList.filter((u) => u !== user));
      console.log("Kullanıcı çıkarıldı:", user);
    });

    newConnection.on("MessageListUpdated", (messages: Message[]) => {
      setChatMessages(messages);
      console.log("Mesaj listesi güncellendi:", messages);
    });

    // Bağlantı başarılı olduğunda mesaj listesini al
    newConnection
      .start()
      .then(() => {
        newConnection
          .invoke("GetMessageList")
          .then((messages: Message[]) => {
            setChatMessages(messages);
            console.log("Mesaj listesi alındı:", messages);
          })
          .catch((error) => console.error("Mesaj listesi alınamadı:", error));
      })
      .catch((error) => console.error("Bağlantı hatası:", error));

    return () => {
      newConnection.stop();
    };
  }, [userName]);

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
          .invoke("AddMessage", {
            username: message.username,
            content: message.content,
            createdOn: new Date(),
          })
          .then(() => {
            console.log("Mesaj gönderildi:", message.content);
            setMessage({
              username: message.username,
              content: "",
              createdOn: new Date(),
            });

            connection.invoke("GetUpdatedMessageList");
          })
          .catch((err) => console.error(err.toString()));
      })
      .catch((err) => console.error(err.toString()));
  };

  return (
    <div>
      <h1>Chat Uygulaması</h1>
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
        {chatMessages === null ? (
          <div>Mesajlar yükleniyor...</div>
        ) : (
          <ul>
            {chatMessages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.username}:</strong> {msg.content}
              </li>
            ))}
          </ul>
        )}
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
