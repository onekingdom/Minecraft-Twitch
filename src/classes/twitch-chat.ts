import { TwitchAPI } from "../axios/twitchAPI";
import { ChannelBadgeResponse, ChatSettingsResponse, getChanneleEmotes, getChattersRequest, getChattersResponse } from "../types/twitchAPI";

class TwitchChat {
  //get all the chatters in a chat room
  async getChatters({ broadcaster_id, moderator_id, after, first }: getChattersRequest): Promise<getChattersResponse> {
    try {
      const res = await TwitchAPI.get<getChattersResponse>(`/chat/chatters`, {
        params: {
          broadcaster_id,
          moderator_id,
          after,
          first,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get channel Emotes
  async getChannelEmotes(broadcaster_id: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes`, {
        params: {
          broadcaster_id,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get global Emotes
  async getGlobalEmotes(): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/global`);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Emote Sets
  async getEmoteSets(emote_set_id: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/set`, {
        params: {
          emote_set_id,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Channel Chat Badges
  async getChannelChatBadges(broadcaster_id: string): Promise<ChannelBadgeResponse> {
    try {
      const res = await TwitchAPI.get<ChannelBadgeResponse>(`/chat/badges`, {
        params: {
          broadcaster_id,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Global Chat Badges
  async getGlobalChatBadges(): Promise<ChannelBadgeResponse> {
    try {
      const res = await TwitchAPI.get<ChannelBadgeResponse>(`/chat/badges/global`);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get Chat Settings
  async getChatSettings(broadcaster_id: string, moderator_id: string): Promise<ChatSettingsResponse> {
    try {
      const res = await TwitchAPI.get<ChatSettingsResponse>(`/chat/settings`, {
        params: {
          broadcaster_id,
          moderator_id,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get User Emotes
  async getUserEmotes(user_id: string, broadcaster_id?: string, after?: string): Promise<getChanneleEmotes> {
    try {
      const res = await TwitchAPI.get<getChanneleEmotes>(`/chat/emotes/user`, {
        params: {
          user_id,
          broadcaster_id,
          after,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update Chat Settings
  async updateChatSettings(broadcaster_id: string, moderator_id: string, settings: ChatSettingsResponse): Promise<ChatSettingsResponse> {
    try {
      const res = await TwitchAPI.patch<ChatSettingsResponse>(`/chat/settings`, settings, {
        params: {
          broadcaster_id,
          moderator_id,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Send Chat Announcement
  async sendChatAnnouncement(broadcaster_id: string, message: string): Promise<void> {
    try {
      await TwitchAPI.post(`/chat/announcements`, {
        broadcaster_id,
        message,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
