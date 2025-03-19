import { AudioResource } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { addOnFinishPlayingAction, connectAndPlay, leaveVoice, play, stop } from "./player";
import { getMp3Resource } from "./mp3-dl-play";
import axios from "axios";
import moment from "moment";

export const queue: VideoData[] = [];

const onPlayingNewTrackActions: ((data: VideoData) => void)[] = [];

export class VideoData {
  title: string;
  duration: number;
  videoId: string;

  constructor(title: string, duration: number, videoId: string) {
    this.title = title;
    this.duration = duration;
    this.videoId = videoId;
  }
}

export async function addToQueue(id: string, voice: VoiceBasedChannel) {
  queue.push(await getVideoData(id));

  if (queue.length === 1) {
    const video = queue[0];
    await connectAndPlay(voice, await getAudioResource(video.videoId));
    onPlayingNewTrackActions.forEach(action => action(video));
  }
}

addOnFinishPlayingAction(async () => {
  queue.shift();
  if (queue.length > 0) {
    const video = queue[0];
    await play(await getAudioResource(video.videoId));
    onPlayingNewTrackActions.forEach(action => action(video));
  }
  else {
    leaveVoice();
  }
});

export function addOnPlayingNewTrack(action: (data: VideoData) => void) {
  onPlayingNewTrackActions.push(action);
}

export function skip() {
  stop();
}

export function clearQueue() {
  queue.length = 0;
  stop();
}

function getAudioResource(videoId: string): Promise<AudioResource> {
  return getMp3Resource(videoId);
}

async function getVideoData(videoId: string): Promise<VideoData> {
  const result = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      part: 'contentDetails,snippet',
      id: videoId,
      key: process.env.YT_API_KEY
    }
  });
  const info = result.data.items[0];  
  const duration = moment.duration(info.contentDetails.duration).asSeconds();
  console.log(duration);
  return new VideoData(info.snippet.title, duration, videoId);
}