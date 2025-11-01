const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'clearwarnings',
        description: 'Clear all warnings for a member',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to clear warnings for',
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
                content: `${user.tag} has no warnings to clear.`,
                ephemeral: true
            });
            return;
        }

        // Remove all warnings for the user
        const updatedWarnings = warnings.filter(w => w.userId !== user.id);
        client.database.set(`warnings-${interaction.guildId}`, updatedWarnings);

        await interaction.reply({ 
            content: `Successfully cleared ${userWarnings.length} warnings for ${user.tag}` 
        });
    }
}).toJSON();