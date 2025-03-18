import { ApplicationCommandDataResolvable, ChatInputCommandInteraction } from "discord.js";

export interface SlashCommand {
  name: string;
  command: ApplicationCommandDataResolvable;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}