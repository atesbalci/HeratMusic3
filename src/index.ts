import { Client, CommandInteraction, Events, GatewayIntentBits } from "discord.js";
import { configDotenv } from "dotenv";
import { Test } from "./commands/test";
import { SlashCommand } from "./command";
import { Play } from "./commands/play";

configDotenv();

const commands: SlashCommand[] = [
  new Test(),
  new Play()
]
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, async readyClient => {
  await client.application?.commands.set(commands.map(ele => ele.command));
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    await commands.find(ele => ele.name === interaction.commandName)?.execute(interaction);
  }
});

client.login(process.env.TOKEN);