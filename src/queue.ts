import { AudioResource } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { addOnFinishPlayingAction, connectAndPlay, leaveVoice, play, stop } from "./player";

export const queue: VideoData[] = [];

const onPlayingNewTrackActions: (() => void)[] = [];

export class VideoData {
  title: string;
  duration: number;
  audio: AudioResource;

  constructor(title: string, duration: number, audio: AudioResource) {
    this.title = title;
    this.duration = duration;
    this.audio = audio;
  }
}

export async function addToQueue(video: VideoData, voice: VoiceBasedChannel) {
  queue.push(video);

  if (queue.length === 1) {
    await connectAndPlay(voice, queue[0].audio);
    onPlayingNewTrackActions.forEach(action => action());
  }
}

addOnFinishPlayingAction(async () => {
  queue.shift();
  if (queue.length > 0) {
    await play(queue[0].audio);
    onPlayingNewTrackActions.forEach(action => action());
  }
  else {
    leaveVoice();
  }
});

export function addOnPlayingNewTrack(action: () => void) {
  onPlayingNewTrackActions.push(action);
}

export function skip() {
  stop();
}

export function clearQueue() {
  queue.length = 0;
  stop();
}