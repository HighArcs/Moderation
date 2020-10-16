const F = discord.command.filters;
commands.on(
  {
    name: 'ban',
    filters: F.or(F.canBanMembers())
  },
  (args) => ({
    member: args.guildMember(),
    reason: args.string()
  }),
  async (message, { member, reason }) => {
      await member.ban({
        reason: `${reason}`
      });
    await message.reply(
      `Banned **${member.user.username}** by **${message.author.username}** for **${reason}**`
    );
  }
);
