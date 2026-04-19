import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc, orderBy, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthProvider';
import { ChatRoom, ChatMessage } from '../types';
import { MessageSquare, Image, FileText, Send, Smile, Paperclip, CheckCircle2, ChevronRight, Hash, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from './ui/toast';

export function ChatManager() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string, data: string, type: string} | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat rooms for this admin
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'portal_chats'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ChatRoom[] = [];
      snapshot.forEach(d => {
        data.push({ id: d.id, ...d.data() } as ChatRoom);
      });
      
      // Sort by latest message
      data.sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis?.() || 0;
        const timeB = b.lastMessageAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      
      setRooms(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Load messages for active room
  useEffect(() => {
    if (!activeToken) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, `portal_chats/${activeToken}/messages`),
      orderBy('timestamp', 'asc')
    );
    
    let isInitialLoad = true;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach(d => {
        const data = d.data();
        msgs.push({
          id: d.id,
          text: data.text,
          sender: data.sender,
          isRead: data.isRead,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
          fileData: data.fileData,
          fileName: data.fileName,
          fileType: data.fileType
        });
      });
      setMessages(msgs);
      
      // Mark as read when active (if client sent them)
      if (msgs.some(m => m.sender === 'client' && !m.isRead)) {
        // We use the REST API to avoid complex batched writes here, but local update works too
        // To be thorough, we would batch update isRead. For now, updating the meta is enough.
        setDoc(doc(db, 'portal_chats', activeToken), { hasUnreadAdmin: false }, { merge: true });
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoad ? 'auto' : 'smooth' });
        isInitialLoad = false;
      }, 100);
    });

    return () => unsubscribe();
  }, [activeToken]);

  const emitTyping = (isTyping: boolean) => {
    if (!activeToken) return;
    setDoc(doc(db, 'portal_chats', activeToken), { adminTyping: isTyping }, { merge: true }).catch(() => {});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitTyping(true);
    
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('File is too large. Max 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        data: event.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToken || ((!newMessage.trim() && !attachedFile)) || sendingMsg) return;

    const msgText = newMessage.trim();
    const fileToSend = attachedFile;
    
    setNewMessage('');
    setAttachedFile(null);
    setShowEmojis(false);
    setSendingMsg(true);
    emitTyping(false);

    try {
      // Using standard Firebase connection for admin since auth operates client-side
      const activeRoom = rooms.find(r => r.id === activeToken);
      
      await addDoc(collection(db, `portal_chats/${activeToken}/messages`), {
        text: msgText || '',
        sender: 'admin',
        isRead: false,
        timestamp: serverTimestamp(),
        ...(fileToSend ? { 
          fileData: fileToSend.data, 
          fileName: fileToSend.name, 
          fileType: fileToSend.type 
        } : {})
      });
      
      const snippet = msgText ? msgText.substring(0, 50) : (fileToSend?.name ? `Attachment: ${fileToSend.name}` : 'Attachment');
      
      await setDoc(doc(db, 'portal_chats', activeToken), {
        lastMessage: snippet,
        lastMessageAt: serverTimestamp(),
        lastSender: 'admin',
        hasUnreadClient: true,
      }, { merge: true });
      
    } catch (err: any) {
      toast(err.message || 'Failed to send message.', 'error');
      setNewMessage(msgText);
      if (fileToSend) setAttachedFile(fileToSend);
    } finally {
      setSendingMsg(false);
    }
  };

  const activeRoom = rooms.find(r => r.id === activeToken);

  return (
    <div className="flex h-full gap-4 relative animate-in fade-in duration-300">
      {/* Left Sidebar: Conversations List */}
      <div className={`w-full md:w-80 flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] shadow-sm overflow-hidden shrink-0 transition-all ${activeToken ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-[#5a8c12]">
            <MessageSquare size={18} />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Inbox</h2>
          </div>
          <span className="text-xs font-bold bg-[#5a8c12] text-white px-2 py-0.5 rounded-full">
            {rooms.length} Active
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {rooms.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <MessageSquare size={32} className="mb-3 opacity-20" />
              <p className="text-sm font-semibold text-slate-500">No active chats</p>
              <p className="text-xs mt-1">Chats appear when clients open their portal or message you.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveToken(room.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-[16px] text-left transition-all ${
                  activeToken === room.id 
                    ? 'bg-[#5a8c12]/10 dark:bg-[#5a8c12]/20 border border-[#5a8c12]/20 dark:border-[#5a8c12]/30' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${room.hasUnreadAdmin ? 'bg-[#5a8c12] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <span className="font-black text-sm uppercase">
                      {room.clientName?.charAt(0) || '?'}
                    </span>
                  </div>
                  {room.hasUnreadAdmin && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm truncate pr-2 ${room.hasUnreadAdmin ? 'font-black text-slate-900 dark:text-slate-100' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                      {room.clientName || 'Unknown Client'}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                      {room.lastMessageAt ? format(room.lastMessageAt.toMillis ? room.lastMessageAt.toMillis() : Date.now(), 'MMM d') : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate max-w-full mt-0.5 ${room.hasUnreadAdmin ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                    {room.clientTyping ? (
                      <span className="text-[#5a8c12] font-bold italic">Typing...</span>
                    ) : (
                      <>{room.lastSender === 'admin' ? 'You: ' : ''}{room.lastMessage || 'No messages yet'}</>
                    )}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar: Chat Area */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] shadow-sm overflow-hidden transition-all ${!activeToken ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!activeToken || !activeRoom ? (
          <div className="text-center p-8 max-w-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-2">Select a Conversation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose a client from the Inbox list to view your chat history and reply instantly.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 shrink-0">
              <button 
                onClick={() => setActiveToken(null)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600"
              >
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-[#5a8c12]/10 dark:bg-[#5a8c12]/20 flex items-center justify-center text-[#5a8c12] shrink-0 font-black">
                {activeRoom.clientName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 truncate">{activeRoom.clientName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  PORTAL TOKEN: {activeToken.substring(0,8)}...
                </p>
              </div>
              <div className="flex gap-2 hidden sm:flex">
                <a 
                  href={`/portal/${activeToken}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
                >
                  View Portal
                </a>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
              <div className="text-center py-4">
                <div className="inline-block bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                  Conversation Started
                </div>
              </div>
              
              {messages.map(msg => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      isAdmin 
                        ? 'bg-[#5a8c12] text-white rounded-br-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.fileName && msg.fileData && (
                        <div className={`mt-2 p-2 rounded-xl border flex items-center gap-3 ${isAdmin ? 'bg-black/10 border-transparent' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                          {msg.fileType?.startsWith('image/') ? (
                            <img src={msg.fileData} alt={msg.fileName} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isAdmin ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                              <Paperclip size={14} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{msg.fileName}</p>
                            <a href={msg.fileData} download={msg.fileName} className={`text-[10px] uppercase font-black hover:underline mt-0.5 block ${isAdmin ? 'text-white/80' : 'text-[#5a8c12]'}`}>
                              Download File
                            </a>
                          </div>
                        </div>
                      )}

                      <div className={`flex items-center gap-1 mt-1.5 justify-end`}>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isAdmin ? 'text-white/60' : 'text-slate-400'}`}>
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </span>
                        {isAdmin && (
                          <CheckCircle2 size={10} className={msg.isRead ? 'text-white' : 'text-white/40'} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {activeRoom.clientTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 w-16">
                    <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-3 shrink-0 rounded-b-[24px]">
              {attachedFile && (
                <div className="mb-2 flex items-center gap-2">
                  <div className="bg-[#5a8c12]/10 border border-[#5a8c12]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-full">
                    <Paperclip size={12} className="text-[#5a8c12] shrink-0" />
                    <span className="text-xs font-bold text-[#5a8c12] dark:text-[#7bb024] truncate">{attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="text-[#5a8c12]/70 hover:text-[#5a8c12] shrink-0 ml-1">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {showEmojis && (
                <div className="py-2 mb-2 border-b border-slate-50 dark:border-slate-800/50 flex gap-2 overflow-x-auto custom-scrollbar">
                  {['👍', '🔥', '✅', '🙌', '🚀', '👀', '💡', '💯', '🤔', '👋'].map(emoji => (
                    <button 
                      key={emoji} 
                      type="button"
                      onClick={() => { setNewMessage(prev => prev + emoji); setShowEmojis(false); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 text-lg transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-end sm:items-center gap-2 relative">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                
                <div className="flex gap-1">
                  <button 
                    type="button"
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                </div>

                <div className="relative flex-1 w-full bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus-within:border-[#5a8c12]/50 dark:focus-within:border-[#5a8c12]/50 transition-all flex items-center pr-2 pl-4 py-1">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none py-2 text-sm focus:outline-none dark:text-slate-100 placeholder:text-slate-400 font-medium disabled:opacity-50"
                    disabled={sendingMsg}
                  />
                  <button 
                    type="submit"
                    disabled={(!newMessage.trim() && !attachedFile) || sendingMsg}
                    className="w-8 h-8 shrink-0 bg-[#5a8c12] text-white rounded-lg flex items-center justify-center hover:bg-[#4a730f] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-[#5a8c12]/20 translate-x-1"
                  >
                    {sendingMsg ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} className="translate-x-[1px]" />}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
