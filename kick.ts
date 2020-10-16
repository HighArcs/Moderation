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
