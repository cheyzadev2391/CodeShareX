module.exports = {
    name: "kick",
    description: "Etiketlenen kullanıcıyı sunucudan atar",
    async execute(client, message, args) {
        if (!message.member.permissions.has("KICK_MEMBERS")) {
            return message.reply("❌ Bu komutu kullanma yetkin yok!");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Atmak için birini etiketlemelisin!");

        try {
            await member.kick();
            message.channel.send(`✅ ${member.user.tag} sunucudan atıldı.`);
        } catch (err) {
            console.error(err);
            message.reply("Kullanıcı atılırken bir hata oluştu.");
        }
    }
};
