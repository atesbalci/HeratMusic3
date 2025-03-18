import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { SlashCommand } from "../command";
import { addToQueue } from "../queue";
import { getMp3VideoData } from "../mp3-dl-play";

const linkRegex = /\/watch\?v\=([0-9a-zA-z]+)/;

export class Play implements SlashCommand {
  name: string = "play";
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Plays a youtube audio")
    .addStringOption(option => option.setRequired(true).setName('url').setDescription('YouTube link'));

  execute = async function(interaction: ChatInputCommandInteraction) {
    const voiceChannel = (interaction.member as GuildMember)?.voice?.channel;
    const url = interaction.options.getString('url');
    const match = linkRegex.exec(url as string);
    if (!voiceChannel || !match) return;
    await interaction.deferReply();
    await addToQueue(await getMp3VideoData(match[1]), voiceChannel);
    await interaction.followUp("Playing...");
  }
}