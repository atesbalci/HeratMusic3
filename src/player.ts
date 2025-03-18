import { VoiceBasedChannel } from "discord.js";
import { AudioResource, createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";

const player = createAudioPlayer({
  behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
  }
});
let connection: VoiceConnection;
let currentAudioSource: AudioResource;
let volume: number = 1;

export async function play(voice: VoiceBasedChannel, audioSource: AudioResource) {
  if (voice) {
    connection = await connectToChannel(voice);
    currentAudioSource = audioSource;
    currentAudioSource.volume?.setVolume(volume);
    player.play(currentAudioSource);
    connection.subscribe(player);
  }
}

async function connectToChannel(channel: VoiceBasedChannel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try {
    connection.on('stateChange', (old_state, new_state) => {
      if (old_state.status === VoiceConnectionStatus.Ready && new_state.status === VoiceConnectionStatus.Connecting) {
        connection.configureNetworking();
      }
    });
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}