import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Send } from 'lucide-react';
import '../styles/AICommandBox.css';

const AICommandBox = () => {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setPrompt(e.target.value);
    };

    const getResponse = async (e) => {
        e.preventDefault();
        if (prompt.trim() === '' || loading) {
            return;
        }
        
        const userMessage = { text: prompt, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setPrompt('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/AI_Command_Box', { prompt });
            setMessages((prevMessages) => [...prevMessages, { text: response.data, sender: 'other' }]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages((prevMessages) => [...prevMessages, { 
                text: "Sorry, I couldn't process your request. Please try again.", 
                sender: 'other' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getResponse(e);
        }
    };

    return (
        <div className='commandBoxContainer'>
            <div className="messageBox">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <MessageSquare size={48} strokeWidth={1} />
                        </div>
                        <p className="empty-title">Ask the AI assistant</p>
                        <p className="empty-subtitle">Type a command to get started...</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={message.sender === 'user' ? 'user-message' : 'other-message'}>
                            {message.text}
                        </div>
                    ))
                )}
                {loading && (
                    <div className="loading-message">
                        <div className="dot-loader">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className='promptForm' onSubmit={getResponse}>
                <input
                    id='prompt'
                    className='promptInput'
                    type="text"
                    value={prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Enter your AI command... ✨'
                    disabled={loading}
                />
                <button className='sendPromptButton' type="submit" disabled={loading || prompt.trim() === ''}>
                    {loading ? 'Sending...' : (
                        <Send size={18} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default AICommandBox;