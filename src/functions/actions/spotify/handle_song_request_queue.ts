import { spotifyAPI } from "@/classes/spotify";
import { supabase } from "@/lib/supabase";
import { TrackObjectFull } from "@/types/spotify-web-api";

interface IntervalMap {
  [broadcaster_id: number]: NodeJS.Timeout;
}

const intervals: IntervalMap = {};

export function startCheckingCurrentSong(broadcaster_id: number): void {
  // Check if the interval is already running for the given broadcaster_id
  if (intervals[broadcaster_id]) {
    console.log(`Interval is already running for channel ${broadcaster_id}`);
    return;
  }

  console.log(`Started checking for channel ${broadcaster_id}`);

  let songID: string = "";
  intervals[broadcaster_id] = setInterval(async () => {
    let res = await spotifyAPI.get_current_song(broadcaster_id);

    if (!res?.item) {
      console.log("No song is currently playing");
      return;
    }

    const song = res?.item as TrackObjectFull;
    

    if (!song) {
      console.log("no song found");
      stopCheckingCurrentSong(broadcaster_id);
      return;
    }

    const queue = await supabase.from("spotify_queue").select("*").eq("broadcaster_id", broadcaster_id);

    console.log(queue.data);

    if (!queue.data) {
      console.log("no queue data found");

      return;
    }

  
    if (queue.data.length === 0) {
      //stop the interval
      console.log("queue is empty stopping interval");
      return stopCheckingCurrentSong(broadcaster_id);
    }



    if (song.id === songID) {
      return;
    }
    songID = song.id ?? "";
    console.log("new song playing" + song.name);



    queue.data?.forEach(async (songs) => {
      if (songs.song_id === song.id) {
        //remove the song from the queue
        const { error } = await supabase.from("spotify_queue").delete().eq("id", songs.id).eq("broadcaster_id", broadcaster_id);
        console.log(`${song.name} removed from queue`);

        if (error) {
          console.log(error);
          console.log("error removing song from queue");
        }
      }
    });
  }, 5000) as NodeJS.Timeout; // 5000 milliseconds = 5 seconds
}

export function stopCheckingCurrentSong(broadcaster_id: number): void {
  if (intervals[broadcaster_id]) {
    console.log(`Stopped checking for channel ${broadcaster_id}`);
    clearInterval(intervals[broadcaster_id]);
    delete intervals[broadcaster_id];
  } else {
    console.log(`No interval found for channel ${broadcaster_id}`);
  }
}

export function isCheckingCurrentSong(broadcaster_id: number): boolean {
  return !!intervals[broadcaster_id];
}
