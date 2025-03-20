import { ButtonInteraction, GuildMember, VoiceBasedChannel, VoiceState } from "discord.js";
import { addToQueue } from "./queue";

export async function handleButton(interaction: ButtonInteraction) {
  await interaction.deferUpdate();
  const videoId = interaction.customId.substring(2);
  const voice = (interaction.member as GuildMember)?.voice.channel;
  if (!voice) return;
  await addToQueue(videoId, voice as VoiceBasedChannel);
  await interaction.followUp('Added to queue');
}