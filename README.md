Verification System:

Auto-sends verification messages when members join
Uses your Rover.party verification URL
Customizable verification channel and roles
Beautiful embed with verification button

Moderation Commands:

/kick - Kick members with reason tracking
/ban - Ban users with message deletion options (0-7 days)
/timeout - Temporarily mute members (1 minute to 28 days)
/warn - Issue warnings with automatic tracking
/warnings - View all warnings for a member
/clearwarnings - Clear all warnings (Admin only)
/clear - Bulk delete messages (1-100, with optional user filter)
/role add/remove - Add or remove roles from members

Setup Commands:

/setup-verify - Configure verification system (channel, roles)
/setup-modlog - Set up moderation logging channel

Key Features:
✅ Role hierarchy protection (can't moderate higher roles)
✅ Automatic moderation logging
✅ Warning system with DM notifications
✅ Comprehensive error handling
✅ Permission checks
✅ Beautiful embeds for all actions
✅ Database storage for warnings and settings
📁 Where to Place Files:
Create these folders and add the files:

src/events/Verification/ → guildMemberAdd.js
src/commands/Moderation/ → All moderation commands
src/commands/Setup/ → Setup commands

🚀 Quick Start:

Install dependencies: npm install
Rename files as per the README
Add your bot token to .env
Run: npm start
In Discord: /setup-verify and /setup-modlog
