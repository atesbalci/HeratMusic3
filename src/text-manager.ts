import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { addOnPlayingNewTrack, queue, VideoData } from "./queue";
import { getCurrentElapsedClipTime } from "./player";

let textChannel: TextChannel | null = null;
let liveDurationText: Message | null = null;

export function setTextChannel(channel: TextChannel) {
  textChannel = channel;
}

addOnPlayingNewTrack(async (data: VideoData) => {
  if (textChannel) {
    removeLiveDuration();
    await textChannel.send({embeds: [songToSmallEmbed(data)]});
    liveDurationText = await textChannel.send({content: currentLiveDurationText() as string});
  }
});

setInterval(() => {
  const text = currentLiveDurationText();
  if (text && liveDurationText) {
    liveDurationText.edit(text);
  }
  else {
    removeLiveDuration();
  }
}, 5000);

function songToSmallEmbed(data: VideoData): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Now Playing: ' + data.title)
    .setURL('https://youtube.com/watch?v=' + data.videoId)
    .setFooter({text: durationToText(data.duration)});
}

function durationToText(duration: number): string {
  const seconds: number = duration % 60;
  return `${Math.floor(duration / 60)}:${seconds.toString().padStart(2, '0')}`;
}

function removeLiveDuration() {
  if (liveDurationText) {
    liveDurationText.delete();
    liveDurationText = null;
  }
}

function currentLiveDurationText(): string | null {
  if (queue.length === 0) return null;
  return `${durationToText(Math.round(getCurrentElapsedClipTime()))} / ${durationToText(queue[0].duration)}`;
}