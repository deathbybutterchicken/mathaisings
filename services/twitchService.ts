import axios from "axios";

export class TwitchService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async authenticate() {
    try {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "client_credentials",
          },
        }
      );
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error("Twitch authentication failed:", error);
      throw error;
    }
  }

  async getStreamInfo(username: string) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await axios.get(
        `https://api.twitch.tv/helix/streams?user_login=${username}`,
        {
          headers: {
            "Client-ID": this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data.data[0]; // Returns stream info if live
    } catch (error) {
      console.error("Failed to get stream info:", error);
      throw error;
    }
  }
}
