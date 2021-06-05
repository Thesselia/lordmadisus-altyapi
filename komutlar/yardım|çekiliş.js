const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.MessageEmbed()
.setColor('RANDOM')
.setTitle('» LordMadisus Çekiliş Komutları')
.addField('?gstart', '**Bulunduğunuz kanalda** çekiliş başlatırsınız')
.addField('?greroll', 'ID sini girdiğiniz çekiliş için yeni kazanan seçer')
.setTimestamp()
.setFooter('LordMadisus', client.user.avatarURL())
.setTimestamp()
.setThumbnail(client.user.avatarURL())
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: ["çekiliş"], 
  permLevel: 0 
};

exports.help = {
  name: 'giweavay',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};