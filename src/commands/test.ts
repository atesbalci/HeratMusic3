import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import { connectAndPlay } from "../player";
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
    await connectAndPlay(voiceChannel, await createAudioResource('yee.mp3', {inlineVolume: true}));
    await interaction.followUp("Hello world!");
  }
}