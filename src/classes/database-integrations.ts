import { supabase } from "@/lib/supabase";

class integrations_database {
  // Get the user's integrations
  async get_user_interactions(broadcaster_id: number) {
    const { error, data: integrations } = await supabase.from("user_integrations").select("*").eq("broadcaster_id", broadcaster_id).single();

    if (error) {
      console.log(error);
      throw error;
    }

    return integrations;
  }



  // update the twitch integration
  async update_twitch_integration(broadcaster_id: string, twitch_integration: any) {
    const { data, error } = await supabase.from("twitch_integration").update([twitch_integration]).eq("broadcaster_id", broadcaster_id);

    if (error) {
      console.log(error);
      throw error;
    }

    return data;
  }



}
export const database_integrations = new integrations_database();
