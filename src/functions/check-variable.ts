import { handleVariable } from "./handle-variable";
const variableRegex = /\${(.*?)}/g;

export default async function checkvariable({ message, channel, channelID, user, userID }: { message: string; channel: string; channelID: number; user: string; userID: string }) {
  let messageArray = message.trim().split(" ");

  const newArray = await Promise.all(
    messageArray.map(async (word) => {
      let replacedWord = word;
      let match;
      while ((match = variableRegex.exec(word)) !== null) {
        const variable = match[1]; // Extract the variable inside the curly braces
        const value = await handleVariable(variable, channel, channelID, userID);
        if (value !== null && value !== undefined) {
          replacedWord = replacedWord.replace(match[0], value.toString());
        }
      }
      return replacedWord;
    })
  );

  return newArray.join(" ");
}