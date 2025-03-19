import { VoiceBasedChannel } from "discord.js";
import { AudioPlayerStatus, AudioResource, createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play
  }
});
const onFinishPlayingActions: (() => void)[] = [];

let connection: VoiceConnection;
let currentAudioSource: AudioResource;
let volume: number = 1;

player.on('stateChange', function(oldState, newState) {
  if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
    onFinishPlayingActions.forEach(action => action());
  }
});

export async function play(audioSource: AudioResource) {
  if (connection && connection.state.status === VoiceConnectionStatus.Ready) {
    currentAudioSource = audioSource;
    currentAudioSource.volume?.setVolume(volume);
    player.play(currentAudioSource);
  }
}

export async function connectAndPlay(voice: VoiceBasedChannel, audioSource: AudioResource) {
  if (voice) {
    leaveVoice();
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

export function getCurrentElapsedClipTime() {
  return player.state.status === AudioPlayerStatus.Playing ? (player.state.playbackDuration / 1000) : 0;
}

export function addOnFinishPlayingAction(action: () => void) {
  onFinishPlayingActions.push(action);
}

export function stop() {
  player.stop();
}

export function leaveVoice() {
  if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
    connection.destroy();
  }
}