import { Client, CommandInteraction, Events, GatewayIntentBits } from "discord.js";
import { configDotenv } from "dotenv";
import { SlashCommand } from "./command";
import { Play } from "./commands/play";
import { Skip } from "./commands/skip";
import { Clear } from "./commands/clear";
import { Queue } from "./commands/queue";
import { Search } from "./commands/search";
import { handleButton } from "./button-handler";

configDotenv();

const commands: SlashCommand[] = [
  new Play(),
  new Skip(),
  new Clear(),
  new Queue(),
  new Search()
];
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, async readyClient => {
  await client.application?.commands.set(commands.map(ele => ele.command));
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    await commands.find(ele => ele.name === interaction.commandName)?.execute(interaction);
  }
  else if (interaction.isButton()) {
    await handleButton(interaction);
  }
});

client.login(process.env.TOKEN);