import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, MessageCircle, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
}

interface QA {
  q: string;
  a: string;
  followUps: string[];
}

const KNOWLEDGE_BASE: Record<string, QA> = {
  "What is Preemptly?": {
    q: "What is Preemptly?",
    a: "Preemptly is an Intelligence Engine that monitors niche communities (like Reddit, Twitter, and specialized forums) to find people expressing high-intent pain points. We alert you the moment someone needs exactly what you sell.",
    followUps: ["How does it work?", "Is there a free trial?"]
  },
  "How does it work?": {
    q: "How does it work?",
    a: "We use proprietary AI models that don't just look for keywords, but understand context and emotion. When the AI detects a 'Match 8+' (high relevance), it flags the lead, provides a strategic rationale, and drafts a context-aware response for you.",
    followUps: ["How accurate is the AI?", "Which platforms?"]
  },
  "Is there a free trial?": {
    q: "Is there a free trial?",
    a: "Yes! We offer a '10-Intercept' free trial. We'll deliver your first 10 hyper-qualified leads for free so you can see the quality yourself. No credit card required.",
    followUps: ["How do I get started?", "How much does it cost?"]
  },
  "How much does it cost?": {
    q: "How much does it cost?",
    a: "During our Closed Beta, we offer a locked-in rate of R500/month. The standard retail price will be R2,500/month once we exit Beta. Joining now locks in your legacy rate forever.",
    followUps: ["Who is it for?", "How do I get started?"]
  },
  "Which platforms?": {
    q: "Which platforms?",
    a: "We currently monitor Reddit, Twitter, and several specialized industry forums. We are constantly expanding our 'Intelligence Network' to include new high-intent sources.",
    followUps: ["Is this just social listening?", "Do you automate DMs?"]
  },
  "Is this just social listening?": {
    q: "Is this just social listening?",
    a: "No. Social listening gives you a megaphone (volume). Preemptly gives you a sniper rifle (intent). We filter out 99% of the noise to give you the 1% that are ready to buy.",
    followUps: ["How accurate is the AI?", "Strategic Rationale?"]
  },
  "How accurate is the AI?": {
    q: "How accurate is the AI?",
    a: "Extremely. Our models are trained specifically on 'intent signals.' Every lead comes with an Intent Score (1-10) and a clear explanation of why it was flagged.",
    followUps: ["Strategic Rationale?", "What is Preemptly?"]
  },
  "Strategic Rationale?": {
    q: "Strategic Rationale?",
    a: "It's an AI-generated explanation of why a prospect is a perfect fit. It helps you understand their pain point instantly so you can approach them from a place of value, not just a pitch.",
    followUps: ["Do you automate DMs?", "Is there a free trial?"]
  },
  "Do you automate DMs?": {
    q: "Do you automate DMs?",
    a: "No. We automate discovery and intelligence, but we believe authentic human connection is key. We provide the intelligence, but you (or your team) hit the send button. This keeps your brand professional and your accounts safe.",
    followUps: ["Is this ethical?", "Who is it for?"]
  },
  "Is this ethical?": {
    q: "Is this ethical?",
    a: "Absolutely. Preemptly is a listening tool, similar to a Google Alert but far more intelligent. You are simply responding to public discussions where users are asking for help or expressing frustration.",
    followUps: ["Is there a free trial?", "Strategic Rationale?"]
  },
  "Who is it for?": {
    q: "Who is it for?",
    a: "Elite agencies, B2B SaaS founders, and high-ticket service providers. Basically, anyone who needs high-intent leads but is tired of cold-calling and low-quality data lists.",
    followUps: ["How much does it cost?", "How do I get started?"]
  },
  "How do I get started?": {
    q: "How do I get started?",
    a: "Click 'Start Free Trial' on our homepage. The onboarding takes less than 60 seconds, and our AI will start hunting for your first batch of leads immediately.",
    followUps: ["Is there a free trial?", "Can I connect my CRM?"]
  },
  "Can I connect my CRM?": {
    q: "Can I connect my CRM?",
    a: "CRM integrations (HubSpot, Salesforce, etc.) are at the top of our road map. For now, you can manage everything from our streamlined Command Center or export leads manually.",
    followUps: ["What is Preemptly?", "How much does it cost?"]
  },
  "What is a 'Match 8+'?": {
    q: "What is a 'Match 8+'?",
    a: "An 8+ Match is our AI's way of saying 'This person is experiencing significant pain right now.' We only notify you when the intent score is 8 or higher, ensuring you don't waste time on lukewarm leads.",
    followUps: ["How accurate is the AI?", "Strategic Rationale?"]
  },
  "How do I respond?": {
    q: "How do I respond?",
    a: "We provide a 'Draft Response' based on the post's context. You can copy this, tweak it to match your voice, and post it as a comment or DM on the respective platform. We recommend being helpful first, pitching second.",
    followUps: ["Do you automate DMs?", "Strategic Rationale?"]
  },
  "What is the Command Center?": {
    q: "What is the Command Center?",
    a: "It's your dashboard where all high-intent leads are centralized. From here, you can see the post, the user, the AI reasoning, and your draft responses. It keeps your lead generation organized and fast.",
    followUps: ["Can I connect my CRM?", "How does it work?"]
  },
  "Is it local-business friendly?": {
    q: "Is it local-business friendly?",
    a: "Absolutely. You can set geo-specific keywords or target communities where local discussions happen. If someone in a city subreddit is looking for a service you provide, Preemptly will catch it.",
    followUps: ["Which platforms?", "How do I get started?"]
  },
  "Annual billing discounts?": {
    q: "Annual billing discounts?",
    a: "Our Beta pricing is already discounted by 80% (R500 vs R2500). Annual billing is coming soon and will offer even further savings for our long-term partners.",
    followUps: ["How much does it cost?", "Who is it for?"]
  },
  "How long is onboarding?": {
    q: "How long is onboarding?",
    a: "Onboarding takes less than 60 seconds. You tell us your niche, your keywords, and your value proposition. Our AI takes it from there and starts 'hunting' across the web instantly.",
    followUps: ["How do I get started?", "What is Preemptly?"]
  },
  "Are leads exclusive?": {
    q: "Are leads exclusive?",
    a: "Yes. While multiple people might monitor the same keywords, we prioritize lead delivery to ensure you have a 'first-mover advantage.' We focus on finding 'hidden' leads that others aren't seeing.",
    followUps: ["Is this just social listening?", "What is a 'Match 8+'?"]
  },
  "Support other languages?": {
    q: "Support other languages?",
    a: "We currently focus on English-speaking communities as they represent the largest volume of intent signals. Multi-language support is in our R&D phase.",
    followUps: ["Which platforms?", "Who is it for?"]
  },
  "What is an 'Intercept'?": {
    q: "What is an 'Intercept'?",
    a: "An intercept is a successful identification of a lead. It means our AI has found a high-intent post, analyzed it, scored it, and delivered it to your dashboard with a strategic rationale.",
    followUps: ["How many intercepts?", "Is there a free trial?"]
  },
  "Can I cancel anytime?": {
    q: "Can I cancel anytime?",
    a: "Yes. Preemptly is a month-to-month service. You can cancel your subscription at any time directly from your account settings with no hidden fees or penalties.",
    followUps: ["How much does it cost?", "Who is it for?"]
  },
  "Is my data secure?": {
    q: "Is my data secure?",
    a: "Completely. We use bank-grade encryption and secure Cloudflare-protected infrastructure to ensure your 'Hunts' and lead data remain private and protected.",
    followUps: ["What is the Command Center?", "Is this ethical?"]
  },
  "Affiliate program?": {
    q: "Affiliate program?",
    a: "Yes! We love working with partners. Our affiliate program offers a 30% recurring commission for the lifetime of any user you refer. Contact us on WhatsApp for details.",
    followUps: ["Chat with us on WhatsApp", "How much does it cost?"]
  },
  "Change keywords later?": {
    q: "Change keywords later?",
    a: "Of course. You can refine your 'Hunts' at any time. In fact, our AI will often suggest better keywords based on the leads it's already finding for you.",
    followUps: ["Strategic Rationale?", "How does it work?"]
  }
};

const INITIAL_SUGGESTIONS = ["What is Preemptly?", "How does it work?"];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', text: "Welcome to Preemptly! I'm here to help you understand how we find high-intent leads for your business. What would you like to know?" }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSuggestionClick = (question: string) => {
    // Add user message
    const newMessage: Message = { id: Date.now().toString(), type: 'user', text: question };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Find answer
    const currentQA = KNOWLEDGE_BASE[question];
    
    // Simulate bot thinking
    setTimeout(() => {
      const botResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        type: 'bot', 
        text: currentQA ? currentQA.a : "That's a great question. I'm still learning about that, but feel free to ask about our engine, pricing, or the free trial!" 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Update suggestions
      if (currentQA && currentQA.followUps.length >= 2) {
        setSuggestions(currentQA.followUps.slice(0, 2));
      } else {
        // Fallback to random or initial if no specific followups
        setSuggestions(INITIAL_SUGGESTIONS);
      }
    }, 1000);
  };

  const openWhatsApp = () => {
    const phone = "0738349023";
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-black p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5a8c12] rounded-xl flex items-center justify-center shadow-lg shadow-[#5a8c12]/20">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-tight">Preemptly Intelligence</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-[#5a8c12] rounded-full animate-pulse" />
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Hunter</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAFAFA]"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.type === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none animate-pulse flex gap-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions area */}
          <div className="p-4 bg-white border-t border-slate-100 space-y-2">
            {!isTyping && suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all hover:border-[#5a8c12] hover:translate-x-1"
              >
                {s}
              </button>
            ))}
            
            {/* Fixed WhatsApp Suggestion */}
            <button
              onClick={openWhatsApp}
              className="w-full text-left p-3.5 bg-[#5a8c12]/5 hover:bg-[#5a8c12]/10 border border-[#5a8c12]/20 rounded-xl text-xs font-black text-[#5a8c12] transition-all flex items-center justify-between group"
            >
              <span>Chat with us on WhatsApp</span>
              <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 scale-110 hover:scale-125 ${
          isOpen ? 'bg-black rotate-90' : 'bg-[#5a8c12] hover:bg-[#6baa15] animate-bounce'
        }`}
        style={{ animationDuration: '3s' }}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <div className="relative">
             <MessageSquare className="text-white" size={24} />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#5a8c12] flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full animate-ping" />
             </div>
          </div>
        )}
      </button>
    </div>
  );
}
