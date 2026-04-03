"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listConversations, getConversationMessages } from "../actions";
import { ArrowLeft, MessageSquare } from "lucide-react";

type Conversation = {
  id: string;
  userId: number | null;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  user: { id: number; name: string; email: string } | null;
};

type Message = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: Date;
};

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadConversations = useCallback(() => {
    listConversations().then(setConversations);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  function handleSelect(id: string) {
    setSelectedId(id);
    startTransition(async () => {
      const msgs = await getConversationMessages(id);
      setMessages(msgs);
    });
  }

  if (selectedId) {
    const conv = conversations.find((c) => c.id === selectedId);
    return (
      <div className="p-6 max-w-4xl space-y-4">
        <Button variant="ghost" onClick={() => { setSelectedId(null); setMessages([]); }}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Conversation</h1>
          <p className="text-sm text-muted-foreground">
            {conv?.user ? `${conv.user.name} (${conv.user.email})` : "Anonymous"} &middot;{" "}
            Language: {conv?.language?.toUpperCase()} &middot;{" "}
            {conv ? new Date(conv.createdAt).toLocaleString() : ""}
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-4 ${
                msg.role === "user"
                  ? "bg-muted ml-12"
                  : "bg-primary/5 mr-12 border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {msg.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {messages.length === 0 && !isPending && (
            <p className="text-center text-muted-foreground py-8">No messages in this conversation.</p>
          )}
          {isPending && (
            <p className="text-center text-muted-foreground py-8">Loading messages...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chat History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {conversations.length} conversations total
        </p>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conv) => (
            <TableRow key={conv.id}>
              <TableCell>
                {conv.user ? (
                  <div>
                    <div className="font-medium">{conv.user.name}</div>
                    <div className="text-xs text-muted-foreground">{conv.user.email}</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Anonymous</span>
                )}
              </TableCell>
              <TableCell>{conv.language?.toUpperCase()}</TableCell>
              <TableCell>{new Date(conv.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(conv.updatedAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSelect(conv.id)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {conversations.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No conversations yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
