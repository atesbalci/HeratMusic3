import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import { skip } from "../queue";

export class Skip implements SlashCommand {
  name: string = "skip";
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Skips the current track");
  execute = async function(interaction: ChatInputCommandInteraction) {
    skip();
    await interaction.reply("Skipping...");
  }
}