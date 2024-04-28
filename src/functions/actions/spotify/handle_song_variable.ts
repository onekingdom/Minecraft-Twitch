import { TrackObjectFull } from "../../../types/spotify-web-api";
const variableRegex = /\${(.*?)}/g;

export default function handleSongVariable(song: TrackObjectFull, varable: string) {
  const intergartion = varable.replace(variableRegex, "$1").split(".");
  let _varable = intergartion[1];

  switch (intergartion[0]) {
    case "song":
      switch (_varable) {
        case "name":
          return song.name;
        case "artist":
          return song.artists[0].name;
        case "album":
          return song.album.name;
        case "url":
          return song.external_urls.spotify;
        case "image":
          return song.album.images[0].url;
        case "release_date":
          return song.album.release_date;
        default:
          return varable;
      }
    default:
      return varable;
  }
}
