const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'kick',
        description: 'Kick a member from the server',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the kick',
                type: 3,
                required: false
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.KickMembers.toString()
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        const member = interaction.guild.members.cache.get(user.id);
        
        if (!member) {
            await interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
            return;
        }

        if (!member.kickable) {
            await interaction.reply({ content: 'I cannot kick this user! They may have a higher role than me.', ephemeral: true });
            return;
        }

        await member.kick(reason);
        await interaction.reply({ content: `Successfully kicked ${user.tag} for: ${reason}` });
    }
}).toJSON();