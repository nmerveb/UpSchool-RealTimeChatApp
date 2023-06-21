import { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [userList, setUserList] = useState<string[]>([]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7163/userhub")
      .build();

    newConnection.start().then(() => {
      newConnection.invoke("GetUserList").then((users) => {
        setUserList([...users]);
      });
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() === "") {
      alert("Lütfen geçerli bir kullanıcı adı girin.");
      return;
    }

    if (userList.includes(userName)) {
      alert("Bu kullanıcı adı zaten mevcut.");
      return;
    }

    navigate(`/chat/${userName}`);
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={handleUsernameChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
