import { cleanEnv, str } from "envalid";
import 'dotenv/config';

export const config = cleanEnv(process.env, {
  DISCORD_TOKEN: str({
    desc: "Discord bot token",
    example: "ABC123.XYZ456",
    docs: "https://discord.com/developers/docs",
  }),
  DISCORD_CLIENT_ID: str({
    desc: "Discord client ID",
    example: "123456789012345678",
    docs: "https://discord.com/developers/docs",
  }),
  DISCORD_GUILD_ID: str({
    desc: "Discord guild ID",
    example: "123456789012345678",
    docs: "https://discord.com/developers/docs",
    default: ""
  }),
});

export type Config = typeof config;
