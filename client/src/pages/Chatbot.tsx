import { useState, useRef, useEffect } from "react";
import { useChatQuery } from "@/hooks/use-placement";
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
  id: string;
  recommendedMaterials?: string[];
  recommendedQuizzes?: string[];
};

export default function Chatbot() {
  const { mutate: sendMessage, isPending } = useChatQuery();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm your AI career advisor. Ask me anything about interviews, resumes, or specific companies.", id: "init" }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg, id: Date.now().toString() }]);

    sendMessage(userMsg, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, {
          role: "bot",
          content: data.response,
          id: (Date.now() + 1).toString(),
          recommendedMaterials: data.recommendedMaterials,
          recommendedQuizzes: data.recommendedQuizzes
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { role: "bot", content: "Sorry, I couldn't process that request. Please try again.", id: (Date.now() + 1).toString() }]);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-lg relative">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/50 backdrop-blur-md flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-foreground leading-tight">Nexus AI Guide</h2>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block" /> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-secondary/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground'}`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl overflow-hidden ${msg.role === 'user'
                ? 'bg-foreground text-background rounded-tr-sm'
                : 'bg-card border border-border text-foreground shadow-sm rounded-tl-sm'
                }`}>
                {msg.role === 'user' ? (
                  <p className="leading-relaxed text-sm">{msg.content}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed prose-p:leading-relaxed prose-pre:bg-secondary/50 prose-pre:text-secondary-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    {((msg.recommendedMaterials && msg.recommendedMaterials.length > 0) || (msg.recommendedQuizzes && msg.recommendedQuizzes.length > 0)) ? (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
                        {msg.recommendedMaterials?.map((mat, i) => (
                          <div key={`mat-${i}`} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">📚 {mat}</div>
                        ))}
                        {msg.recommendedQuizzes?.map((quiz, i) => (
                          <div key={`quiz-${i}`} className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md font-medium">📝 {quiz}</div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-2 rounded-tl-sm">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border z-10">
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about interview tips, resume building..."
            className="flex-1 h-14 rounded-2xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 pr-14 text-base"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isPending}
            className="absolute right-2 top-2 bottom-2 h-10 w-10 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
