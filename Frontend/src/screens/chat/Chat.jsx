import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Search, Info, ArrowLeft, Users, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Chat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      content: "Hey everyone! How's the project going?",
      timestamp: "10:30 AM",
      isOwn: false,
      avatar: "JD",
    },
    {
      id: 2,
      sender: "You",
      content: "Going great! Just finished the authentication module.",
      timestamp: "10:32 AM",
      isOwn: true,
      avatar: "You",
    },
    {
      id: 3,
      sender: "Sarah Wilson",
      content:
        "Perfect! I've uploaded the design files to the group. Check them out when you can.",
      timestamp: "10:35 AM",
      isOwn: false,
      avatar: "SW",
    },
    {
      id: 4,
      sender: "You",
      content: "Thanks Sarah! The designs look amazing 🎨",
      timestamp: "10:38 AM",
      isOwn: true,
      avatar: "You",
    },
    {
      id: 5,
      sender: "Mike Chen",
      content:
        "Should we schedule a call for tomorrow to discuss the next phase?",
      timestamp: "10:40 AM",
      isOwn: false,
      avatar: "MC",
    },
  ]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Mock group data - replace with actual data from Redux/API
  const groupData = {
    name: "Computer Science Study Group",
    members: [
      {
        name: "John Doe",
        status: "online",
        avatar: "JD",
        email: "john@example.com",
      },
      {
        name: "Sarah Wilson",
        status: "online",
        avatar: "SW",
        email: "sarah@example.com",
      },
      {
        name: "Mike Chen",
        status: "away",
        avatar: "MC",
        email: "mike@example.com",
      },
      {
        name: "Emma Davis",
        status: "offline",
        avatar: "ED",
        email: "emma@example.com",
      },
      {
        name: "Alex Turner",
        status: "online",
        avatar: "AT",
        email: "alex@example.com",
      },
    ],
  };

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "🎉",
    "💯",
    "👏",
    "🙏",
    "💪",
    "🚀",
    "⭐",
    "✨",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        avatar: "You",
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate response
        const response = {
          id: messages.length + 2,
          sender: "John Doe",
          content: "Sounds good! 👍",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: false,
          avatar: "JD",
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <button
                onClick={() => navigate("/home/chatmenu")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors md:hidden"
              >
                <ArrowLeft
                  size={20}
                  className="text-gray-600 dark:text-slate-400"
                />
              </button>

              {/* Group Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {groupData.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {
                    groupData.members.filter((m) => m.status === "online")
                      .length
                  }{" "}
                  online • {groupData.members.length} members
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search messages..."
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-48 hidden md:block"
                />
              </div>
              <button
                onClick={() => setShowGroupInfo(!showGroupInfo)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Info size={18} className="text-gray-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isOwn ? "justify-end" : "justify-start"
              } items-end gap-2`}
            >
              {/* Avatar for others' messages */}
              {!msg.isOwn && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {msg.avatar}
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                {/* Sender name for others' messages */}
                {!msg.isOwn && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 ml-3">
                    {msg.sender}
                  </p>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Timestamp */}
                <p
                  className={`text-xs text-gray-500 dark:text-slate-400 mt-1 ${
                    msg.isOwn ? "text-right mr-3" : "ml-3"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>

              {/* Avatar for own messages */}
              {msg.isOwn && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                JD
              </div>
              <div className="bg-white dark:bg-slate-700 px-4 py-2 rounded-2xl border border-gray-200 dark:border-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg p-4 grid grid-cols-8 gap-2 z-10">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessage((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:bg-gray-100 dark:hover:bg-slate-600 rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                ref={messageInputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 resize-none min-h-[48px] max-h-32"
                style={{ height: "auto" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />

              {/* Emoji Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
              >
                <Smile
                  size={18}
                  className="text-gray-600 dark:text-slate-400"
                />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Group Info Sidebar */}
      {showGroupInfo && (
        <div className="w-80 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Group Info
            </h3>
            <button
              onClick={() => setShowGroupInfo(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <X size={18} className="text-gray-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Group Details */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                {groupData.name}
              </h4>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Members ({groupData.members.length})
              </h5>
              <div className="space-y-3">
                {groupData.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                          member.status
                        )} rounded-full border-2 border-white dark:border-slate-800`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                        {member.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
