import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import styles from './AIAssistantChat.module.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIAssistantChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Hello ${user?.name || ''}! I'm your EvaraTech Assistant. How can I help you manage your infrastructure today?`, sender: 'ai', timestamp: new Date() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('/ai/command', { text: input });
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.message || "Command executed successfully.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the intelligence core. Please try again.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.chatWindow}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <div className={styles.header}>
                            <div className={styles.aiInfo}>
                                <div className={styles.aiAvatar}>🤖</div>
                                <div>
                                    <h3 className={styles.aiName}>EvaraMind</h3>
                                    <span className={styles.aiStatus}>Intelligent Assistant</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>×</button>
                        </div>

                        <div className={styles.messagesArea}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                                    <div className={styles.bubble}>{msg.text}</div>
                                    <span className={styles.time}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isTyping && (
                                <div className={`${styles.message} ${styles.ai}`}>
                                    <div className={styles.typingIndicator}>
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a command (e.g., 'motor status')"
                                className={styles.chatInput}
                            />
                            <button onClick={handleSend} className={styles.sendBtn}>
                                ➤
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className={styles.triggerIcon}>🧠</div>
                {!isOpen && <div className={styles.notification}>1</div>}
            </motion.button>
        </div>
    );
};

export default AIAssistantChat;
