//Strikes by Asian Nate#8962 and WhyHewwo#5530 on Discord.
const strikeKV = new pylon.KVNamespace('strike');

commands.on(
  'strike',
  (args) => ({ members: args.guildMember(), reason: args.text() }),
  async (message, { members, reason }) => {
    discord.command.filters.isAdministrator();
    if (members.user.bot) return await message.reply('You cannot strike bots!');
    const oldCount = (await strikeKV.get<number>(members.user.id)) || 0;

    let newCount = oldCount + 1;

    if (isNaN(newCount as number)) return await message.reply('invalid count');

    await strikeKV.put(members.user.id, (oldCount + 1) as number);
    await message.reply(
      `**${
        members.user.username
      }** has received a strike for **${reason}** and now has **${oldCount +
        1}** strikes.`
    );
  }
);

commands.on(
  { name: 'strikereset', description: 'set to 0' },
  (args) => ({
    user: args.guildMember()
  }),
  async (message, { user }) => {
    discord.command.filters.isAdministrator();
    const oldCount = (await strikeKV.get<number>(user.user.id)) || 0;
    let newCount = 0;
    if (isNaN(newCount as number)) return await message.reply('invalid number');
      await strikeKV.put(user.user.id, newCount as number);
    await message.reply(
      `**${user.user.getTag()}**'s strikes have been reset from **${oldCount}** to **0**.`
    );
  }
);

commands.on(
  { name: 'striketop', description: 'top strikes' },
  () => ({}),
  async (message) => {
    const items = await strikeKV.items();
    const sorted = items
      .filter((entry) => !isNaN((entry.key as unknown) as number))
      .sort((a, b) => (b.value as number) - (a.value as number));
    const top = sorted.slice(0, 10);
    const userMap = await Promise.all(
      top.map((entry) =>
        discord
          .getUser(entry.key)
          .then((user) => ({ user, strikes: entry.value }))
      )
    );

    await message.reply(
      new discord.Embed({
        title: `Top ${userMap.length} strikes ${discord.decor.Emojis.X}`,
        description: userMap
          .map(
            (entry) => `\`${entry.user?.getTag()}\`: ${entry.strikes} strikes`
          )
          .join('\n')
      })
    );
  }
);

//strike modifying
commands.on(
  {
    name: 'strikemodify',
    description: 'modify a users strikes'
  },
  (args) => ({ who: args.user(), count: args.string(), reason: args.text() }),
  async (message, { who, count, reason }) => {
    if (!(await discord.command.filters.isAdministrator().filter(message)))
      return await message.reply('missing permissions');

    if (who.bot)
      return await message.reply(
        'thats a.. bot. you wanna modify a bots strike??'
      );
    const oldCount = (await strikeKV.get<number>(who.id)) || 0;
    let newCount = oldCount;
    if (count.startsWith('+')) newCount += parseInt(count.replace('+', ''));
    else if (count.startsWith('-'))
      newCount -= parseInt(count.replace('-', ''));
    else newCount = parseInt(count);
      if (isNaN(newCount as number))
        return await message.reply('invalid count');

    await strikeKV.put(who.id, newCount as number);
    await message.reply(
      `Ok, updated ${who.getTag()}'s strikes from **${oldCount}** to **${newCount}** for **${reason}**`
    );
  }
);

//show message author's number of strikes
commands.on(
  { name: 'strikes', description: 'strike count' },
  (args) => ({}),
  async (message, {}) => {
    const target = message.author;
    const currentCount = (await strikeKV.get<number>(target.id)) || 0;
    await message.reply(
      new discord.Embed({
        title: `${discord.decor.Emojis.X} Strike count ${discord.decor.Emojis.X}`,
        description: `${message.author.getTag()} has ${currentCount} strikes${
          currentCount === 1 ? '' : ''
        }. ${discord.decor.Emojis.X.repeat(Math.min(currentCount, 100))}`,
        color: 0xff0000,
        thumbnail: { url: message.author.getAvatarUrl() }
      })
    );
  }
);

//inspect a user's number of strikes
commands.on(
  { name: 'strikeinspect', description: 'strike count' },
  (args) => ({ who: args.user() }),
  async (message, { who }) => {
    const currentCount = (await strikeKV.get<number>(who.id)) || 0;
    await message.reply(
      new discord.Embed({
        title: `${discord.decor.Emojis.X} strike count ${discord.decor.Emojis.X}`,
        description: `${who.getTag()} has ${currentCount} strikes ${
          currentCount === 1 ? '' : ''
        } ${discord.decor.Emojis.X.repeat(Math.min(currentCount, 100))}`,
        color: 0xff0000,
        thumbnail: { url: who.getAvatarUrl() }
      })
    );
  }
);
