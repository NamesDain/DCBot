const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'clear',
        description: 'Clear messages from the channel',
        type: 1,
        options: [
            {
                name: 'amount',
                description: 'Number of messages to clear (1-100)',
                type: 4,
                required: true,
                minValue: 1,
                maxValue: 100
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.ManageMessages.toString()
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const amount = interaction.options.getInteger('amount');
        
        try {
            const messages = await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ 
                content: `Successfully deleted ${messages.size} messages!`,
                ephemeral: true 
            });
        } catch (error) {
            await interaction.reply({ 
                content: 'Failed to delete messages. Messages older than 14 days cannot be bulk deleted.',
                ephemeral: true 
            });
        }
    }
}).toJSON();