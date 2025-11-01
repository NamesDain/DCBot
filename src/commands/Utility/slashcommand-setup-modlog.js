const { ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'setup-modlog',
        description: 'Set up a moderation log channel',
        type: 1,
        options: [
            {
                name: 'channel',
                description: 'The channel to use for mod logs',
                type: 7,
                required: true,
                channel_types: [ChannelType.GuildText]
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
        
        if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'ViewChannel'])) {
            await interaction.reply({ 
                content: 'I need permission to send messages in that channel!',
                ephemeral: true 
            });
            return;
        }

        // Save mod log channel to database
        client.database.set(`modlog-${interaction.guildId}`, channel.id);

        await interaction.reply({ 
            content: `Successfully set up mod logs in ${channel}` 
        });

        // Send test message to mod log channel
        await channel.send({ 
            content: '🛡️ Mod logs have been set up in this channel.' 
        });
    }
}).toJSON();