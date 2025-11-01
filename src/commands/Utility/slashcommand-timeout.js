const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'timeout',
        description: 'Timeout a member',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to timeout',
                type: 6,
                required: true
            },
            {
                name: 'duration',
                description: 'Timeout duration in minutes',
                type: 4,
                required: true,
                minValue: 1,
                maxValue: 40320 // 4 weeks in minutes
            },
            {
                name: 'reason',
                description: 'Reason for the timeout',
                type: 3,
                required: false
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
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        const member = interaction.guild.members.cache.get(user.id);
        
        if (!member) {
            await interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
            return;
        }

        if (!member.moderatable) {
            await interaction.reply({ content: 'I cannot timeout this user! They may have a higher role than me.', ephemeral: true });
            return;
        }

        try {
            await member.timeout(duration * 60 * 1000, reason);
            await interaction.reply({ 
                content: `Successfully timed out ${user.tag} for ${duration} minutes.\nReason: ${reason}` 
            });
        } catch (error) {
            await interaction.reply({ 
                content: 'Failed to timeout the user. They may have a role higher than me.',
                ephemeral: true 
            });
        }
    }
}).toJSON();