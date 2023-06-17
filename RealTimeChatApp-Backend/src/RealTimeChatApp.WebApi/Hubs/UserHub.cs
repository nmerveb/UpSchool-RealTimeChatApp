using Microsoft.AspNetCore.SignalR;

namespace RealTimeChatApp.WebApi.Hubs
{
    public class UserHub : Hub
    {
        //task lis message mesajlari doner api olmadan 
        private static List<string> userList = new List<string>();
        private static List<Message> messageList = new List<Message>();

        public List<string> GetUserList()
        {
            return userList;
        }

        public void AddUser(string username)
        {
            userList.Add(username);
            Clients.All.SendAsync("UserAdded", username);
        }

        public void DeleteUser(string username)
        {
            userList.Remove(username);
            Clients.All.SendAsync("UserDeleted", username);
        }

        public List<Message> GetMessageList()
        {
            return messageList;
        }

        public void AddMessage(Message message)
        {
            message.CreatedOn = DateTime.Now;
            messageList.Add(message);
            Clients.All.SendAsync("MessageAdded", message);
        }
    }

    public class Message
    {
        public string Username { get; set; }
        public string Content { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}



