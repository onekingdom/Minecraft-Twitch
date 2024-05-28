import { supabase } from "@/lib/supabase";
import { UpdateTwitchIntegrationTable } from "@/types/database";

class integrations_database {
  // Get the user's integrations
  async get_user_interactions(user_id: string) {
    const { error, data: integrations } = await supabase.from("user_integrations").select("*").eq("user_id", user_id).single();

    if (error) {
      console.log(error);
      throw error;
    }

    return integrations;
  }



  // update the twitch integration
  async update_twitch_integration(user_id: string, twitch_integration: UpdateTwitchIntegrationTable) {
    const { data, error } = await supabase.from("twitch_integration").update(twitch_integration).eq("user_id", user_id);

    if (error) {
      console.log(error);
      throw error;
    }

    return data;
  }


  async get_twitch_integration(user_id: string) {
    const { data, error } = await supabase.from("twitch_integration").select("*").eq("user_id", user_id).single();

    if (error) {
      console.log(error);
      throw error;
    }

    return data;
  }


}
export const database_integrations = new integrations_database();
