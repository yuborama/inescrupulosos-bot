import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("msgdirect") // Nombre del comando
  .setDescription("Envía un mensaje a un usuario") // Descripción del comando
  .addUserOption(
    (option) =>
      option
        .setName("destinatario") // Nombre de la opción
        .setDescription("El usuario al que quieres enviar el mensaje") // Descripción de la opción
        .setRequired(true), // Hace que este campo sea obligatorio
  )
  .addStringOption(
    (option) =>
      option
        .setName("mensaje") // Nombre de la opción
        .setDescription("El mensaje que quieres enviar") // Descripción de la opción
        .setRequired(true), // Hace que este campo sea obligatorio
  );

export async function execute(interaction: CommandInteraction) {
  // Obtener los valores de las opciones
  const destinatario = interaction.options.get("destinatario", true).user;
  const mensaje = interaction.options.get("mensaje", true).value as string;

  // Verificar que los valores estén presentes
  if (!destinatario || !mensaje) {
    return interaction.reply("¡Error! Faltan campos requeridos.");
  }

  // Enviar un mensaje al destinatario
  try {
    await destinatario.send(mensaje); // Enviar mensaje directo al usuario
    await interaction.reply(
      `Mensaje enviado a ${destinatario.tag}: "${mensaje}"`,
    );
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    await interaction.reply(
      "No se pudo enviar el mensaje. Asegúrate de que el destinatario pueda recibir mensajes directos.",
    );
  }
}
