import { ActionRowBuilder, ApplicationCommandDataResolvable, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import search, { YouTubeSearchOptions } from "youtube-search";

export class Search implements SlashCommand {
  name: string = 'search';
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Search')
    .addStringOption(option => option.setRequired(true).setName('query').setDescription('Search query'));

  execute = async function(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('query') as string;
    await interaction.deferReply();
    const opts: YouTubeSearchOptions = {
      maxResults: 10,
      type: 'video',
      safeSearch: 'none',
      key: process.env.YT_API_KEY
    };
    const resp = await search(query, opts).catch(console.error);
    if (resp) {
      const videos = resp.results;
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      for (let i = 0; i < videos.length; i++) {
        const ele = videos[i];
        const button = new ButtonBuilder()
          .setLabel(`${ele.title.substring(0, Math.min(ele.title.length, 80))}`)
          .setCustomId(`l_${ele.id}`)
          .setStyle(ButtonStyle.Primary);
        if (i % 2 == 0) {
          rows.push(new ActionRowBuilder());
        }
        rows[rows.length - 1].addComponents([button]);
      }
      await interaction.followUp({content: `Search results for: ${query}`, components: rows});
    }
    else {
      await interaction.followUp('Search Failed');
    }
  }
}