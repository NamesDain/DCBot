const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'warn',
        description: 'Warn a member',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to warn',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the warning',
                type: 3,
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
        const reason = interaction.options.getString('reason');
        
        const warningId = Date.now().toString(36);
        const warningData = {
            id: warningId,
            userId: user.id,
            moderatorId: interaction.user.id,
            reason: reason,
            timestamp: Date.now()
        };

        // Get existing warnings or create new array
        const warnings = client.database.get(`warnings-${interaction.guildId}`) || [];
        warnings.push(warningData);
        
        // Save warning to database
        client.database.set(`warnings-${interaction.guildId}`, warnings);

        await interaction.reply({ 
            content: `Successfully warned ${user.tag}\nWarning ID: ${warningId}\nReason: ${reason}` 
        });
    }
}).toJSON();