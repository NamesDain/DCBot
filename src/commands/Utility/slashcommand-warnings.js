const { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'warnings',
        description: 'View warnings for a member',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to check warnings for',
                type: 6,
                required: true
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.ModerateMembers.toString()
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        
        // Get warnings from database
        const warnings = client.database.get(`warnings-${interaction.guildId}`) || [];
        const userWarnings = warnings.filter(w => w.userId === user.id);

        if (userWarnings.length === 0) {
            await interaction.reply({ 
                content: `${user.tag} has no warnings.`,
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#FF4444')
            .setTitle(`Warnings for ${user.tag}`)
            .setDescription(`Total Warnings: ${userWarnings.length}`)
            .addFields(
                userWarnings.map(warning => ({
                    name: `Warning ID: ${warning.id}`,
                    value: `Reason: ${warning.reason}\nModerator: <@${warning.moderatorId}>\nDate: <t:${Math.floor(warning.timestamp / 1000)}:R>`,
                    inline: false
                }))
            );

        await interaction.reply({ embeds: [embed] });
    }
}).toJSON();