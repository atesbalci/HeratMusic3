import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../command";
import { queue } from "../queue";

export class Queue implements SlashCommand {
  name: string = "queue";
  command: ApplicationCommandDataResolvable = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription("Shows the queue");
  execute = async function(interaction: ChatInputCommandInteraction) {
    if (queue.length > 0) {
        await interaction.deferReply();
        let queueTexts = [''];
        for (let i = 0; i < queue.length; i++) {
          const song = queue[i];
          const indexText = i > 0 ? `${i}.` : 'Now Playing:';
          const textToBeAdded = `${indexText} ${song.title}\n`;
          if (queueTexts[queueTexts.length - 1].length + textToBeAdded.length > 1900) {
            queueTexts.push('');
          }
          queueTexts[queueTexts.length - 1] += textToBeAdded;
        }
        for (let i = 0; i < queueTexts.length; i++) {
          await interaction.followUp(queueTexts[i]);      
        }
      }
      else {
        await interaction.reply('The queue is empty');
      }
  }
}