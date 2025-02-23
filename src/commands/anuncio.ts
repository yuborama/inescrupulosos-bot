import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  TextChannel,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("anuncio")
  .setDescription("Envía un mensaje a todos los usuarios con un rol específico")
  // Opciones requeridas (deben ir primero)
  .addRoleOption((option) =>
    option
      .setName("rol")
      .setDescription("El rol al que quieres enviar el mensaje")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("serie")
      .setDescription("El nombre de la serie")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("capitulo")
      .setDescription("El número del capítulo")
      .setRequired(true),
  )
  .addAttachmentOption((option) =>
    option
      .setName("imagen")
      .setDescription("La imagen del capítulo (archivo adjunto)")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("enlace")
      .setDescription("El enlace al capítulo")
      .setRequired(true),
  )
  // Opciones opcionales (deben ir después de las requeridas)
  .addRoleOption((option) =>
    option
      .setName("rol2")
      .setDescription("El rol al que quieres enviar el mensaje")
      .setRequired(false),
  )
  .addAttachmentOption((option) =>
    option
      .setName("archivo")
      .setDescription("El archivo que quieres enviar")
      .setRequired(false),
  );

export async function execute(interaction: CommandInteraction) {
  const rol = interaction.options.get("rol", true).role;
  const serie = interaction.options.get("serie", true).value;
  const numCap = interaction.options.get("capitulo", true).value;
  const imagen = interaction.options.get("imagen", true)?.attachment;
  const enlace = interaction.options.get("enlace", true).value;
  // ========================================================
  const rol2 = interaction.options.get("rol2", false)?.role;
  const archivo = interaction.options.get("archivo", false)?.attachment;

  // Extraer el canal de la interacción
  const canal = interaction.channel;

  // Verificar que el canal sea un TextChannel
  if (!canal || !(canal instanceof TextChannel)) {
    return interaction.reply({
      content: "¡Error! Este comando solo puede usarse en un canal de texto.",
      ephemeral: true,
    });
  }

  // Verificar que los valores requeridos estén presentes
  if (!rol || !serie || !numCap || !imagen || !enlace) {
    return interaction.reply({
      content: "¡Error! Faltan campos requeridos.",
      ephemeral: true,
    });
  }

  // Verificar que el comando se usó en un servidor (guild)
  if (!interaction.guild) {
    return interaction.reply({
      content: "Este comando solo puede usarse en un servidor.",
      ephemeral: true,
    });
  }

  try {
    // Crear el Embed
    const embed = new EmbedBuilder()
      .setColor(rol?.color ?? 0x3498db)
      .setTitle(`📚 ¡Nuevo capítulo de ${serie} ya disponible!`)
      .addFields([
        {
          name: `👀 ¡El capítulo ${numCap} está listo para que lo leas!`,
          value: "",
        },
        {
          name: `🔗 ¡Haz clic y sumérgete en la acción! Disponible en: ${enlace}`,
          value: "",
        },
      ])
      .setImage(imagen.url);

    // Crear el botón de descarga si se proporciona un archivo
    let componentes = [];
    if (archivo) {
      const boton = new ButtonBuilder()
        .setLabel("Descargar PDF")
        .setStyle(ButtonStyle.Link)
        .setURL(archivo.url);

      const fila = new ActionRowBuilder<ButtonBuilder>().addComponents(boton);
      componentes.push(fila);
    }

    // Enviar el mensaje al canal de la interacción
    await canal.send({
      content: `${rol} ${rol2 ? rol2 : ""}`,
      embeds: [embed],
      components: componentes,
    });

    // Responder al usuario que el mensaje se envió correctamente
    await interaction.reply({
      content: `¡Mensaje enviado correctamente al canal ${canal.name}!`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    await interaction.reply({
      content:
        "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde." +
        error,
      ephemeral: true,
    });
  }
}
