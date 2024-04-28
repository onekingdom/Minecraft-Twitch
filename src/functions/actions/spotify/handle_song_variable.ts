import { TrackObjectFull } from "../../../types/spotify-web-api";
const variableRegex = /\${(.*?)}/g;

export default function handleSongVariable(song: TrackObjectFull, varable: string) {
  
  const intergartion = varable.replace(variableRegex, "$1").split(".");
  let _varable = intergartion[1];

  // remove the RexEx from the message
  // remove the ${} from the variable

  console.log(_varable);

  

  switch (_varable) {
    case "name":
      return song.name;

    case "artists":
      return song.artists.map((artist) => artist.name);


    default:
      return varable;
  }
}
