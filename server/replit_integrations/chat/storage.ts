import { ConversationModel, MessageModel } from "../../models";
import { type Conversation, type Message } from "@shared/schema";

export interface IChatStorage {
  getConversation(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(conversationId: string, role: string, content: string): Promise<Message>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: string) {
    const conversation = await ConversationModel.findById(id);
    return conversation ? conversation.toJSON() : undefined;
  },

  async getAllConversations() {
    const conversations = await ConversationModel.find().sort({ createdAt: -1 });
    return conversations.map(c => c.toJSON());
  },

  async createConversation(title: string) {
    const conversation = await ConversationModel.create({ title });
    return conversation.toJSON();
  },

  async deleteConversation(id: string) {
    await MessageModel.deleteMany({ conversationId: id });
    await ConversationModel.findByIdAndDelete(id);
  },

  async getMessagesByConversation(conversationId: string) {
    const messages = await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
    return messages.map(m => m.toJSON());
  },

  async createMessage(conversationId: string, role: string, content: string) {
    const message = await MessageModel.create({ conversationId, role, content });
    return message.toJSON();
  },
};
