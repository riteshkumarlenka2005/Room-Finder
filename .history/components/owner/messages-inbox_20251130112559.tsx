"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: 1,
    name: "Neha Gupta",
    lastMessage: "Is the 2BHK in Whitefield still available?",
    time: "2h ago",
    unread: 2,
    avatar: "NG",
    property: "2BHK Apartment, Whitefield",
    messages: [
      { id: 1, sender: "them", text: "Hello, I'm interested in the 2BHK apartment.", time: "10:00 AM" },
      { id: 2, sender: "me", text: "Hi! Yes, it's available. Would you like to schedule a visit?", time: "10:05 AM" },
      { id: 3, sender: "them", text: "Yes please! Is tomorrow afternoon possible?", time: "10:10 AM" },
      { id: 4, sender: "me", text: "Tomorrow 3 PM works. I'll send you the address.", time: "10:15 AM" },
      { id: 5, sender: "them", text: "Is the 2BHK in Whitefield still available?", time: "2:00 PM" },
    ],
  },
  {
    id: 2,
    name: "Rahul Verma",
    lastMessage: "Can I schedule a visit for tomorrow?",
    time: "5h ago",
    unread: 1,
    avatar: "RV",
    property: "Single Room, Indiranagar",
    messages: [
      { id: 1, sender: "them", text: "Hi, I saw your single room listing in Indiranagar.", time: "9:00 AM" },
      { id: 2, sender: "me", text: "Hello! Yes, it's a great room. Are you a student?", time: "9:30 AM" },
      { id: 3, sender: "them", text: "Can I schedule a visit for tomorrow?", time: "11:00 AM" },
    ],
  },
  {
    id: 3,
    name: "Sneha Reddy",
    lastMessage: "What are the amenities included?",
    time: "1d ago",
    unread: 0,
    avatar: "SR",
    property: "PG Room, HSR Layout",
    messages: [
      { id: 1, sender: "them", text: "Hello, I'm looking for a PG room.", time: "Yesterday" },
      { id: 2, sender: "me", text: "Hi Sneha! We have rooms available in HSR Layout.", time: "Yesterday" },
      { id: 3, sender: "them", text: "What are the amenities included?", time: "Yesterday" },
    ],
  },
  {
    id: 4,
    name: "Amit Sharma",
    lastMessage: "Thank you for the quick response!",
    time: "2d ago",
    unread: 0,
    avatar: "AS",
    property: "2BHK Apartment, Koramangala",
    messages: [
      { id: 1, sender: "them", text: "Is the Koramangala apartment still available?", time: "2 days ago" },
      { id: 2, sender: "me", text: "Yes, it is! Monthly rent is ₹15,000.", time: "2 days ago" },
      { id: 3, sender: "them", text: "Thank you for the quick response!", time: "2 days ago" },
    ],
  },
]

export function MessagesInbox() {
  const [selectedConversation, setSelectedConversation] = useState<(typeof conversations)[0] | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // Handle sending message
    setNewMessage("")
  }

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px]">
      <Card className="border-0 shadow-sm h-full">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={cn("w-full md:w-80 border-r flex flex-col", selectedConversation && "hidden md:flex")}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                      selectedConversation?.id === conv.id && "bg-muted",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">{conv.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.property}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && <Badge className="bg-blue-600 text-white shrink-0">{conv.unread}</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={cn("flex-1 flex flex-col", !selectedConversation && "hidden md:flex")}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedConversation.property}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            message.sender === "me" ? "bg-blue-600 text-white rounded-br-md" : "bg-muted rounded-bl-md",
                          )}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              message.sender === "me" ? "text-blue-100" : "text-muted-foreground",
                            )}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
                  <p className="text-muted-foreground">
                    Select a conversation to start chatting with potential tenants.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
