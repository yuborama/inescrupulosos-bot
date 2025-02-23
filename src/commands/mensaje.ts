import {
  SlashCommandBuilder,
  CommandInteraction,
  ChannelType,
  TextChannel,
  Attachment,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("mensaje")
  .setDescription("Envía un mensaje a un canal específico")
  .addChannelOption((option) =>
    option
      .setName("canal")
      .setDescription("El canal donde quieres enviar el mensaje")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText),
  )
  .addStringOption((option) =>
    option
      .setName("mensaje")
      .setDescription("El mensaje que quieres enviar")
      .setRequired(false),
  )
  .addAttachmentOption((option) =>
    option
      .setName("imagen")
      .setDescription("La imagen que quieres enviar")
      .setRequired(false),
  );

export async function execute(interaction: CommandInteraction) {
  const mensaje = interaction.options.get("mensaje", false)?.value;
  const imagen = interaction.options.get("imagen", false)?.attachment;

  const canalOption = interaction.options.get("canal", true);

  if (!mensaje && !imagen) {
    return interaction.reply({
      content: "¡Error! Debes proporcionar al menos un mensaje o una imagen.",
      ephemeral: true,
    });
  }

  if (
    !canalOption.channel ||
    canalOption.channel.type !== ChannelType.GuildText
  ) {
    return interaction.reply({
      content: "¡Error! Debes seleccionar un canal de texto válido.",
      ephemeral: true,
    });
  }

  const canal = canalOption.channel as TextChannel;

  if (!interaction.guild) {
    return interaction.reply({
      content: "Este comando solo puede usarse en un servidor.",
      ephemeral: true,
    });
  }

  try {
    const contenido: { content?: string; files?: Attachment[] } = {};
    if (mensaje) {
      contenido.content = mensaje as string;
    }
    if (imagen) {
      contenido.files = [imagen];
    }
    await canal.send(contenido);
    await interaction.reply({
      content: `¡Mensaje enviado correctamente al canal ${canal.name}!`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    await interaction.reply({
      content:
        "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.",
      ephemeral: true,
    });
  }
}
