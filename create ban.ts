const S = discord.command.filters;
commands.on(
  {
    name: 'createban',
    filters: S.or(S.canBanMembers())
  },
  (args) => ({
    userid: args.string(),
    reason: args.text()
  }),
  async (message, { userid, reason }) => {
    const guild = await discord.getGuild();
      await guild.createBan(userid, { reason });
    ({
      reason: `${reason}`
    });
    await message.reply(
      `banned <@${userid}> by **${message.author.username}** for **${reason}**`
    );
  }
);
