const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'role',
        description: 'Add or remove a role from a user',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'The user to modify roles for',
                type: 6,
                required: true
            },
            {
                name: 'role',
                description: 'The role to add/remove',
                type: 8,
                required: true
            },
            {
                name: 'action',
                description: 'Whether to add or remove the role',
                type: 3,
                required: true,
                choices: [
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                ]
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.ManageRoles
    },
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const action = interaction.options.getString('action');
        
        const member = interaction.guild.members.cache.get(user.id);
        
        if (!member) {
            await interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
            return;
        }

        if (!role.editable) {
            await interaction.reply({ 
                content: 'I cannot modify that role! It might be higher than my highest role.',
                ephemeral: true 
            });
            return;
        }

        try {
            if (action === 'add') {
                if (member.roles.cache.has(role.id)) {
                    await interaction.reply({ 
                        content: `${user.tag} already has the ${role.name} role!`,
                        ephemeral: true 
                    });
                    return;
                }
                await member.roles.add(role);
                await interaction.reply({ content: `Added the ${role.name} role to ${user.tag}` });
            } else {
                if (!member.roles.cache.has(role.id)) {
                    await interaction.reply({ 
                        content: `${user.tag} doesn't have the ${role.name} role!`,
                        ephemeral: true 
                    });
                    return;
                }
                await member.roles.remove(role);
                await interaction.reply({ content: `Removed the ${role.name} role from ${user.tag}` });
            }
        } catch (error) {
            await interaction.reply({ 
                content: 'Failed to modify roles. Make sure I have the proper permissions.',
                ephemeral: true 
            });
        }
    }
}).toJSON();