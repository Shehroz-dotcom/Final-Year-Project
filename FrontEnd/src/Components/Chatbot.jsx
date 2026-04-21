import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import ReactMarkdown from 'react-markdown';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onSubmit = async (data) => {
    try {
      if (!data.message.trim()) return;

      const userMessage = {
        role: 'user',
        content: data.message,
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      reset();

      const response = await axios.post(
        `${Urls.dev}/api/v1/chatbot/query`,
        { message: data.message },
        { withCredentials: true }
      );

      const botMessage = {
        role: 'bot',
        content: response.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-end">
      {/* CHAT WINDOW */}
      {open && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl mb-3 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="bg-black text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Chat Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-100 space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm text-center mt-10">
                Start the conversation...
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] shadow ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-900 text-white rounded-bl-sm'
                  }`}
                >
                  {/* 🔥 Markdown rendering for bot */}
                  {msg.role === 'bot' ? (
                    <div className="prose prose-invert text-sm leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-gray-900 text-white text-sm animate-pulse">
                  typing...
                </div>
              </div>
            )}

            {/* AUTO SCROLL */}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-2 border-t flex gap-2"
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 outline-none"
              {...register('message', { required: true })}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 rounded-lg cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-xl"
      >
        💬
      </button>
    </div>
  );
};
