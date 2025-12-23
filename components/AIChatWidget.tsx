import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import clsx from 'clsx';
import { useLanguage } from '../contexts/LanguageContext';

export const AIChatWidget: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  
  // Initialize history with translated welcome message
  useEffect(() => {
    setHistory([{
      id: 'init',
      text: t('chat.welcome'),
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, [language, t]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      // Pass current language to chat service
      const responseText = await getChatResponse(userMsg.text, language);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t('common.error'),
        sender: 'ai',
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(
      "fixed bottom-6 z-50 flex flex-col font-sans",
      dir === 'rtl' ? "left-6 items-start" : "right-6 items-end"
    )}>
      {/* Chat Window */}
      <div className={clsx(
        "bg-white rounded-2xl shadow-2xl border border-gray-200 w-[350px] sm:w-[400px] transition-all duration-300 ease-in-out overflow-hidden mb-4 flex flex-col",
        isOpen ? "opacity-100 translate-y-0 h-[500px]" : "opacity-0 translate-y-10 h-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="bg-brand-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t('chat.advisor')}</h3>
              <p className="text-xs text-brand-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> {t('chat.online')}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {history.map((msg) => (
            <div 
              key={msg.id} 
              className={clsx(
                "flex flex-col max-w-[85%] text-sm",
                msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div className={clsx(
                "p-3 rounded-2xl shadow-sm",
                msg.sender === 'user' 
                  ? (dir === 'rtl' ? "bg-brand-600 text-white rounded-bl-none" : "bg-brand-600 text-white rounded-br-none")
                  : (dir === 'rtl' ? "bg-white text-gray-800 border border-gray-200 rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none")
              )}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
              <Loader2 size={16} className="animate-spin text-brand-600" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 shrink-0 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
          />
          <button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className={clsx(
               "bg-brand-600 text-white p-2.5 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
               dir === 'rtl' && "rotate-180"
            )}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
          isOpen ? "bg-gray-800 text-white rotate-90" : "bg-brand-600 text-white hover:bg-brand-700 hover:scale-105"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};