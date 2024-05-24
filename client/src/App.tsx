import { useEffect, useState } from "react";
import { Message } from "../../server/types";
import { socket } from "./socket";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message>();
  const [name, setName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleMessage = (value: Message) =>
      setMessages((prev) => [...prev, value]);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
    };
  }, []);

  const handleSubmitName = () => {
    if (name) socket.emit("setName", name);
  };

  const handleSendImage = () => {
    if (image.trim() !== "") {
      socket.emit("message", {
        type: "image",
        content: image,
        replyMessage: undefined,
      });
      setImage("");
    }
  };

  const handleMessageSend = () => {
    if (inputMessage) {
      socket.emit("message", {
        type: "text",
        replyTo,
        content: inputMessage,
        replyMessage: undefined,
      });
      setInputMessage("");
      setReplyTo(undefined);
    }
  };

  const handleReplyTo = (message: Message) => {
    setReplyTo(message);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4 gap-4">
      <header className="flex justify-start items-center text-3xl font-bold mb-10 bg-gradient-to-r from-indigo-500 rounded-l-full">
        <span>
          <img
            src="https://img.freepik.com/free-vector/girl-whispering-gossip-secret-her-friend-pop-art-style_88138-369.jpg?t=st=1716382414~exp=1716386014~hmac=efb06f91c34c551ab85af06456dfbb112ba7064c430e8d5a382e355d1a91bc36&w=1480"
            alt=""
            className="w-28 h-28 rounded-full"
          />
        </span>
        <h1 className="p-4 mx-4">GOSSIP</h1>
      </header>

      <div className="flex space-x-4 my-10 w-96">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className=" p-2 border border-gray-600 rounded-md focus:outline-none bg-gray-800 text-white"
        />
        <button
          onClick={handleSubmitName}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
        >
          Enter
        </button>
      </div>

      <div className="flex flex-col space-y-2 mt-4 mb-10">
        {replyTo && (
          <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md">
            <span className="text-gray-300">Replying to {replyTo.name}:</span>
            <button className="text-red-500" onClick={() => setReplyTo(null)}>
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-center w-96 mr-4">
          <input
            type="text"
            placeholder="Enter a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-600 rounded-md focus:outline-none bg-gray-800 text-white"
          />
          <button
            onClick={handleMessageSend}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none ml-2"
          >
            Send Message
          </button>
        </div>

        <div className="flex items-center mt-4 mb-4">
          <input
            type="text"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className=" p-2 border border-gray-600 rounded-md focus:outline-none bg-gray-800 text-white"
          />
          <button
            onClick={handleSendImage}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none ml-2"
          >
            Send Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {messages.map((message, index) => (
          <div key={index} className="flex items-center">
            {message.type === "text" ? (
              <p
                className="rounded-lg bg-gray-800 p-2 shadow-md"
                onClick={() => handleReplyTo(message)}
              >
                <span className="font-bold">{message.name}:</span>{" "}
                {message.content}
              </p>
            ) : (
              <img
                src={message.content}
                alt="Sent Image"
                className="w-24 h-24 mr-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
