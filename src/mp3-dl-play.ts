import axios, { AxiosRequestConfig } from "axios";
import { createAudioResource, StreamType } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { play } from "./player";

export async function playMp3Url(id: string, voice: VoiceBasedChannel) {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: id},
    headers: {
      'x-rapidapi-key': process.env.X_RAPID_API_KEY,
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
    }
  };
  const response = await axios.request(options);
  const mp3Options: AxiosRequestConfig = {
    method: 'GET',
    url: response.data.link,
    responseType: 'stream'
  }
  const mp3Stream = (await axios.request(mp3Options)).data;
  play(voice, await createAudioResource(mp3Stream, {
    inlineVolume: true,
    inputType: StreamType.Arbitrary
  }));
}