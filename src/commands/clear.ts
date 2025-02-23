import { SlashCommandBuilder, CommandInteraction, TextChannel, GuildMember, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina una cantidad específica de mensajes.')
    .addIntegerOption(option =>
        option.setName('cantidad')
            .setDescription('Número de mensajes a eliminar (1-100)')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages); // Solo usuarios con permiso para gestionar mensajes pueden usar este comando

export async function execute(interaction: CommandInteraction) {
    // Verifica si el comando se ejecuta en un servidor
    if (!interaction.inGuild()) {
        return interaction.reply({
            content: 'Este comando solo puede usarse en un servidor.',
            ephemeral: true,
        });
    }

    // Verifica si el usuario tiene permisos para gestionar mensajes
    const member = interaction.member as GuildMember;
    if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({
            content: 'No tienes permiso para eliminar mensajes.',
            ephemeral: true,
        });
    }

    // Obtiene la cantidad de mensajes a eliminar
    const cantidad = interaction.options.get('cantidad', true).value as number;

    // Valida que la cantidad esté entre 1 y 100
    if (cantidad < 1 || cantidad > 100) {
        return interaction.reply({
            content: 'La cantidad debe ser un número entre 1 y 100.',
            ephemeral: true,
        });
    }

    // Elimina los mensajes
    const channel = interaction.channel as TextChannel;
    try {
        await channel.bulkDelete(cantidad, true); // El segundo parámetro (true) ignora mensajes antiguos
        await interaction.reply({
            content: `Se eliminaron ${cantidad} mensajes correctamente.`,
            ephemeral: true,
        });
    } catch (error) {
        console.error('Error al eliminar mensajes:', error);
        await interaction.reply({
            content: 'Ocurrió un error al intentar eliminar los mensajes.' + error,
            ephemeral: true,
        });
    }
}
