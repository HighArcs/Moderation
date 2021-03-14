commands.on(
  'ban',
  (args) => ({ user: args.user(), reason: args.textOptional() }),
  async (interaction, { user, reason }) => {
    if (user.id == interaction.author.id) return await interaction.reply("❌ You can't target yourself"); // block banning yourself :^)
    if (user.id == discord.getBotId()) return await interaction.reply('❌ You may not target me'); // block banning the bot
    if (!interaction.member.can(discord.Permissions.BAN_MEMBERS)) return await interaction.reply("❌ You can't ban members"); // check if the user can actually ban
    // lol
    if (await (await discord.getGuild()).getBan(user.id)) return await interaction.reply({content: `❌ ${user.toMention()} is already banned!`, allowedMentions: {}}); // dont ban already banned users
    try { guild.createBan(user, { reason: `🔨 [${interaction.author.getTag()}] ${reason}` }) } // ban the user
    catch { return await interaction.reply({ content: '❌ Failed to ban user' }) } // lol 
    return await interaction.reply({
      content: `✅ Banned ${user.toMention()} ${reason ? `with reason \`${reason}\`` : ""}`,
      allowedMentions: {}
    });
  }
);
