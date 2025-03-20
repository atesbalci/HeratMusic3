import { ButtonInteraction, GuildMember, TextChannel, VoiceBasedChannel, VoiceState } from "discord.js";
import { addToQueue } from "./queue";
import { setTextChannel } from "./text-manager";

export async function handleButton(interaction: ButtonInteraction) {
  await interaction.deferUpdate();
  const videoId = interaction.customId.substring(2);
  const voice = (interaction.member as GuildMember)?.voice.channel;
  if (!voice) return;
  setTextChannel(interaction.channel as TextChannel);
  await addToQueue(videoId, voice as VoiceBasedChannel);
  await interaction.followUp('Added to queue');
}