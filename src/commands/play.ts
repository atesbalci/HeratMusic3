import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandStringOption, TextChannel } from "discord.js";
import { SlashCommand } from "../command";
import { addToQueue } from "../queue";
import { setTextChannel } from "../text-manager";

const linkRegex = /\/watch\?v\=([A-Za-z0-9_\-]+)/;

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
    setTextChannel(interaction.channel as TextChannel);
    await addToQueue(match[1], voiceChannel);
    await interaction.followUp("Added to queue");
  }
}