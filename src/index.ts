import { Client } from "discord.js";
import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";

console.log(config);
export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMembers"],
});

client.once("ready", () => {
  // forzar la actualización de comandos
  /*  deployCommands({ guildId: config.DISCORD_GUILD_ID })
    .then(() =>
      console.log(`Comandos registrados en el servidor con ID: ${config.DISCORD_GUILD_ID}`),
    )
    .catch((error) => console.error("Error al registrar comandos:", error)); */
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
