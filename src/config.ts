import { cleanEnv, str } from "envalid";

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
});

export type Config = typeof config;
