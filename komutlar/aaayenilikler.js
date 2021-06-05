const Discord = require('discord.js');

exports.run = async (client, message) => {
      message.channel.send(new Discord.MessageEmbed() 
                          .setTitle("**YENİLİKLER**")
                          .setDescription("Nsfw eklendi \n plsmeme komutu eklendi \n Yenilikler komutu eklendi \n otorol sistemi eklendi"))

  };
  
  exports.conf = {
    enabled: true,

    aliases: ['yenilikler'],
    permLevel: 0,
  };
  
  exports.help = {
    name: "yeni",
    description: "ücretsiz",
    usage: "ücretsizbağış",

  };