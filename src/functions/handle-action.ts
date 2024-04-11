import { CommandDatabase } from "../classes/database-commands";
import { UserLevel } from "../types/database";

export default async function handle_action(action: string, args: string[], channelID: number, chatter_name: string): Promise<string | undefined> {
  const bitch = action.split(".");

  const catagory = bitch[0];
  const _action = bitch[1];

  switch (catagory) {
    case "command":
      switch (args[0]) {
        case "add":
          const command = args[1];
          const message = args.slice(2);

          if (!command || !message) return "Invalid arguments";

          // add command

          const res = await CommandDatabase.addCommand({
            action: null,
            channelID,
            command: command.replace("${command}", ""),
            cooldown: 5,
            created_by: chatter_name,
            description: "No description",
            enabled: true,
            message: message.join(" ").replace("${message}", ""),
            userlevel: UserLevel.everyone,
          });

          console.log(res);

          if (res) return "Command added successfully";
          return "Failed to add command";

          break;
        case "edit":
          const editCommand = await CommandDatabase.findCommand(args[1], channelID);

          if(!editCommand) return `Command ${args[1]} does not seem to exist`

          const newmessage = args.slice(2).join(" ");

          const edit_command_res = await CommandDatabase.editCommand(editCommand.$id, newmessage, channelID);

          if(edit_command_res) return "Command edited successfully";

          return "Failed to edit command";

          break;
        case "delete":
          const find_command = await CommandDatabase.findCommand(args[1], channelID);

          if (!find_command) return "Command does not seem to exist";

          const del_res = await CommandDatabase.deleteCommand(find_command.$id, channelID);

          return `Command ${find_command.command} deleted successfully`;

          break;
      }
      break;

      return;
  }
}
