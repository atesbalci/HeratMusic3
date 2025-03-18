import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import { clearQueue } from "../queue";

export class Clear implements SlashCommand {
  name: string = "clear";
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Clears the queue");
  execute = async function(interaction: ChatInputCommandInteraction) {
    clearQueue();
    await interaction.reply("Clearing queue...");
  }
}