
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { AiIcon } from './icons/AiIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';

const AiAdvisor: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestedQuestions = [
        "How do I secure my router?",
        "Tell me more about software updates.",
        "What should I do about data breaches?",
        "What is phishing?",
    ];

    // Initialize chat
    useEffect(() => {
        const initializeChat = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and knowledgeable AI Security Advisor for a security suite application called Tibbles Source Of Security. Your goal is to help users understand security concepts and how to use the application to protect themselves. Start the conversation with a brief analysis of the user's system security based on these key points: a router vulnerability, 4 outdated apps, 2 data breaches for their email, and 4 Windows privacy settings to harden. Keep your answers concise, helpful, and easy to understand.",
                    },
                });
                setChat(chatSession);

                const response = await chatSession.sendMessageStream({ message: "Hello! Please provide your initial analysis." });
                
                let text = '';
                const initialAiMessageId = Date.now();
                setMessages([{ id: initialAiMessageId, sender: 'ai', text: '' }]);

                for await (const chunk of response) {
                    text += chunk.text;
                    setMessages(prev => prev.map(msg => 
                        msg.id === initialAiMessageId ? { ...msg, text } : msg
                    ));
                }
            } catch (error) {
                console.error("Failed to initialize AI Advisor:", error);
                setMessages([{ id: Date.now(), sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, []);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chat || isLoading) return;

        const text = messageText.trim();
        setUserInput('');
        const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: text });
            
            let responseText = '';
            const aiMessageId = Date.now() + 1;
            // Add a placeholder for the AI response
            setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

            for await (const chunk of responseStream) {
                responseText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: responseText } : msg
                ));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-4rem)] bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 mb-6 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
                                <AiIcon className="w-6 h-6 text-blue-300" />
                            </div>
                        )}
                        <div className={`p-4 rounded-xl max-w-2xl ${msg.sender === 'ai' ? 'bg-gray-700/50 text-gray-300' : 'bg-blue-600 text-white'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && messages.length > 0 && (
                     <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
                            <AiIcon className="w-6 h-6 text-blue-300" />
                        </div>
                        <div className="p-4 rounded-xl bg-gray-700/50 text-gray-300">
                           <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast" style={{animationDelay: '0s'}}></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.15s'}}></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.3s'}}></span>
                           </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700/50">
                {!isLoading && messages.length < 2 && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {suggestedQuestions.map((q, i) => (
                            <button key={i} onClick={() => handleSendMessage(q)} disabled={isLoading} className="text-left p-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm text-blue-300 font-medium transition-colors">
                                {q}
                            </button>
                        ))}
                    </div>
                )}
                <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about your security..."
                        disabled={isLoading}
                        className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-500 text-white font-semibold p-3 rounded-lg transition-colors">
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AiAdvisor;