"use client";

import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/lib/socket/SocketContext";

export interface ChatRoom {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  type: "public" | "dm" | "game_lobby";
  icon?: string;
  lastMessageAt?: string;
}

export interface UserChatMessage {
  _id?: string;
  id?: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaUrl?: string | null;
  reactions?: Array<{ emoji: string; userId: string }>;
  createdAt: string;
}

export function useCommunityChat(selectedRoomId: string | null) {
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<UserChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch rooms list
  const fetchRooms = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/community-chat/rooms`);
      if (!res.ok) return;
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle joining room and loading message history
  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);

    const loadHistory = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${baseUrl}/api/community-chat/rooms/${selectedRoomId}/messages`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load message history:", err);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    };

    loadHistory();

    if (socket && isConnected) {
      socket.emit("join_room", { roomId: selectedRoomId });
    }

    return () => {
      isMounted = false;
      if (socket && isConnected) {
        socket.emit("leave_room", { roomId: selectedRoomId });
      }
    };
  }, [selectedRoomId, socket, isConnected]);

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: UserChatMessage) => {
      const msgRoomId = String(msg.roomId);
      if (selectedRoomId && msgRoomId === String(selectedRoomId)) {
        setMessages((prev) => {
          // Guard duplicate messages
          const exists = prev.some(
            (m) => (m._id || m.id) === (msg._id || msg.id)
          );
          if (exists) return prev;
          return [...prev, msg];
        });
      }

      // Update room lastMessageAt
      setRooms((prev) =>
        prev.map((r) =>
          (r._id || r.id) === msgRoomId
            ? { ...r, lastMessageAt: msg.createdAt }
            : r
        )
      );
    };

    const handleUserTyping = (data: {
      roomId: string;
      userName: string;
      isTyping: boolean;
    }) => {
      if (selectedRoomId && String(data.roomId) === String(selectedRoomId)) {
        setTypingUsers((prev) => {
          if (data.isTyping) {
            return prev.includes(data.userName) ? prev : [...prev, data.userName];
          } else {
            return prev.filter((name) => name !== data.userName);
          }
        });
      }
    };

    const handleMessageUpdated = (updatedMsg: UserChatMessage) => {
      setMessages((prev) =>
        prev.map((m) =>
          (m._id || m.id) === (updatedMsg._id || updatedMsg.id) ? updatedMsg : m
        )
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("message_updated", handleMessageUpdated);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("message_updated", handleMessageUpdated);
    };
  }, [socket, selectedRoomId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !selectedRoomId || !content.trim()) return;

      socket.emit(
        "send_message",
        { roomId: selectedRoomId, content: content.trim() },
        (res: { error?: string; message?: UserChatMessage }) => {
          if (res?.error) {
            console.error("Failed to send message:", res.error);
          }
        }
      );
    },
    [socket, selectedRoomId]
  );

  const startTyping = useCallback(() => {
    if (socket && selectedRoomId) {
      socket.emit("typing_start", { roomId: selectedRoomId });
    }
  }, [socket, selectedRoomId]);

  const stopTyping = useCallback(() => {
    if (socket && selectedRoomId) {
      socket.emit("typing_stop", { roomId: selectedRoomId });
    }
  }, [socket, selectedRoomId]);

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (socket) {
        socket.emit("toggle_reaction", { messageId, emoji });
      }
    },
    [socket]
  );

  return {
    rooms,
    messages,
    typingUsers,
    isLoadingMessages,
    sendMessage,
    startTyping,
    stopTyping,
    toggleReaction,
    refreshRooms: fetchRooms,
  };
}
