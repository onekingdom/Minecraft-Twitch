export default function get_song_id(searchQuery: string): string | void {
  let id: string | undefined;

  // check if the serach query is a URL
  if (searchQuery.includes("https://open.spotify.com/")) {
    const url = new URL(searchQuery);
    const pathParts = url.pathname.split("/");

    if (pathParts.length !== 3 || pathParts[0] !== "") {
      throw new Error("Invalid URL");
    }

    id = pathParts[2];
  }

  // check if the search query is a spotify uri
  else if (searchQuery.includes("spotify:track:")) {
    id = searchQuery.split("spotify:track:")[1];
  }

  return id;
}
