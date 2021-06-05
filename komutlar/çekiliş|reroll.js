const Discord = require('discord.js');
const ms = require('ms');
const path = require('path');

module.exports.run = async (client, message, args) => {
    let hasPerm = message.member.hasPermission('MANAGE_MESSAGES');
    let hasRole = message.member.roles.cache.find(r => r.name === 'Giveaways');



        if (hasPerm === false || !hasRole == null) return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('__HATA__')
                .setColor('RED')
                .setDescription('Bu komutu kullanmak için `MANAGE_MESSAGES` izinlerine veya ``Giveaways`` adlı bir role ihtiyacınız var.')
                .setTimestamp()
        )

        if (!args[0]) {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('__HATA__')
                    .setColor('RED')
                    .setDescription('Lütfen, çekiliş mesajının ID sini gir')
                    .setTimestamp()
            )
        }

        client.giveawaysManager.reroll(args[0], {
            messages: {
                congrat: "\`🎁\`・Tebrikler: {winners}",
            }
        })
}

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: ["greroll"], 
  permLevel: 0 
};

exports.help = {
  name: 'grr',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};