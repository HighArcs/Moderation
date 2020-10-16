//kick members
commands.on(
  { name: 'kick', filters: discord.command.filters.canKickMembers() },
  (ctx) => ({
    member: ctx.guildMember(),
    reason: ctx.textOptional()
  }),
  async (message, { member, reason }) => {
    await member.kick();
    await message.reply(
      `Cya, ${member.toMention()} - you were kicked because ${reason}!`
    );
  }
);

//ban members
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

//create a ban as long as you have their user ID
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
      `aborted <@${userid}> by **${message.author.username}** for **${reason}**`
    );
  }
);
