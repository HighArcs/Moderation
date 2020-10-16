discord.on('MESSAGE_CREATE', async (message) => {
  if (message.content.toLowerCase().includes('PROHIBITED_WORD')) {
    message.delete();
    await message.reply(
      `${message.author.toMention()}, your message has been deleted due to containing prohibited text`
    );
  }
});
