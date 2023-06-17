import React, { ChangeEvent, useState } from "react";

type LoginPageProps = {
  onJoinChat: (username: string) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onJoinChat }) => {
  const [username, setUsername] = useState<string>("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleJoinChat = () => {
    if (username.trim() === "") {
      alert("Lütfen geçerli bir kullanıcı adı girin.");
      return;
    }

    onJoinChat(username);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#F7FFE5",
        width: "100wh",
        height: "100vh",
      }}
    >
      <div style={{ marginInline: "5px" }}>
        <h1 style={{ marginTop: "100%" }}>Upstorage Chat</h1>
        <div>
          <div style={{ marginBlock: "8%", fontSize: "20px" }}>Name:</div>
          <input
            style={{ height: "25px", width: "100%" }}
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <button className="send-button" onClick={handleJoinChat}>
            <span style={{ color: "white" }}>Join Chat!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// import React, { useEffect, useState } from "react";
// import { HubConnectionBuilder } from "@microsoft/signalr";

// const LoginPage = () => {
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     const connection = new HubConnectionBuilder()
//       .withUrl("https://localhost:7163/userhub")
//       .build();

//     connection
//       .start()
//       .then(() => {
//         connection.on("UserAdded", (addedUsername) => {
//           if (addedUsername === username) {
//             console.log("Kullanıcı eklendi:", username);
//             // ChatPage sayfasına yönlendirme işlemleri burada gerçekleştirilebilir
//           }
//         });
//       })
//       .catch((error) => console.error(error));

//     return () => {
//       connection.stop();
//     };
//   }, [username]);

//   const handleUsernameChange = (e: any) => {
//     setUsername(e.target.value);
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     if (username.trim() === "") {
//       alert("Lütfen geçerli bir kullanıcı adı girin.");
//       return;
//     }

//     const connection = new HubConnectionBuilder()
//       .withUrl("https://localhost:7163/userhub")
//       .build();

//     connection
//       .start()
//       .then(() => {
//         connection
//           .invoke("AddUser", username)
//           .catch((error) => console.error(error));
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <div className="container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={handleUsernameChange}
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
