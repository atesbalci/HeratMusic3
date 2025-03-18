import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import { play } from "../player";
import { createAudioResource } from "@discordjs/voice";

export class Test implements SlashCommand {
  name: string = "test";
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("This is a test command");
  execute = async function(interaction: ChatInputCommandInteraction) {
    const voiceChannel = (interaction.member as GuildMember)?.voice?.channel;
    if (!voiceChannel) return;
    await interaction.deferReply();
    await play(voiceChannel, await createAudioResource('yee.mp3', {inlineVolume: true}));
    await interaction.followUp("Hello world!");
  }
}