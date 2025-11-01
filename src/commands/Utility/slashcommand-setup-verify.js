const { ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'setup-verify',
        description: 'Set up a verification system',
        type: 1,
        options: [
            {
                name: 'channel',
                description: 'The channel to use for verification',
                type: 7,
                required: true,
                channel_types: [ChannelType.GuildText]
            },
            {
                name: 'role',
                description: 'The role to give when verified',
                type: 8,
                required: true
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.ManageGuild.toString()
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        
        if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'ViewChannel'])) {
            await interaction.reply({ 
                content: 'I need permission to send messages in that channel!',
                ephemeral: true 
            });
            return;
        }

        if (!role.editable) {
            await interaction.reply({ 
                content: 'I cannot assign that role! It might be higher than my highest role.',
                ephemeral: true 
            });
            return;
        }

        // Save verification settings to database
        client.database.set(`verify-${interaction.guildId}`, {
            channelId: channel.id,
            roleId: role.id
        });

        await interaction.reply({ 
            content: `Successfully set up verification system:\nChannel: ${channel}\nRole: ${role}` 
        });

        // Send verification message
        const msg = await channel.send({ 
            content: '**🔐 Verification System**\nClick the button below to verify yourself and gain access to the server!',
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 1,
                    custom_id: 'verify-button',
                    label: 'Verify',
                    emoji: '✅'
                }]
            }]
        });

        // Save message ID for the verification system
        client.database.set(`verify-message-${interaction.guildId}`, msg.id);
    }
}).toJSON();