import axios, { AxiosRequestConfig } from "axios";
import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";

export async function getMp3Resource(id: string) : Promise<AudioResource> {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: id},
    headers: {
      'x-rapidapi-key': process.env.X_RAPID_API_KEY,
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
    }
  };
  await new Promise(resolve => setTimeout(resolve, 3000));
  const response = await axios.request(options);
  console.log(response.data);
  const mp3Options: AxiosRequestConfig = {
    method: 'GET',
    url: response.data.link,
    responseType: 'stream'
  }
  const mp3Stream = (await axios.request(mp3Options)).data;
  const audio = await createAudioResource(mp3Stream, {
    inlineVolume: true,
    inputType: StreamType.Arbitrary
  });
  return audio;
}