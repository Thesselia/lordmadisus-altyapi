const Discord = require('discord.js');
const discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { Client, Util } = require('discord.js');
require('./util/eventloader.js')(client);
const fs = require('fs');
const chalk = require('chalk');
var prefix = ayarlar.prefix;
const db = require("quick.db")




client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();



fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});





const log = message => {
    console.log(`${message}`);
};





client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
    
      client.login(process.env.token);

client.on("message", message => {
    if(message.content.toLowerCase() === '?i') {
        const ist = new Discord.MessageEmbed()

        .setTitle('Botun istatistikleri')
        .setColor('RED')
        .addField('İstatistikler :',`  **${client.guilds.cache.size}** sunucuya hizmet veriyorum \n  **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}** kullanıcıya hizmet veriyorum  \n **${client.channels.cache.size.toLocaleString()}** kanala hizmet veriyorum \n **ping**: ${client.ws.ping} ms`)
        .setThumbnail(client.user.avatarURL({dynamic : true}))
        .setFooter('Botun istatistikleri')
        message.channel.send(ist)
    } 
});
 
const http = require("http");
const moment = require("moment");
const express = require("express");
const fetch = require('node-fetch');
const app = express();
const xprefix = '+' //PREFİXİNİZİ GİRİNİZ.
 
setInterval(() => {
const Linkler = db.get('Linkler')
if(!Linkler) return;
const De = Linkler.map(Revenge => Revenge.url)
De.forEach(Link => {
try {
fetch(Link)
} catch(e) {
console.error(e)
}
})
console.log(`${client.user.username} | ${db.get('Proje') || 1} Proje Hostandı`)
}, 60000)

client.on('ready', () => {
console.log(`${client.user.username} Aktif!`)
if(!Array.isArray(db.get('Linkler'))) {
db.set('Linkler', [])
}
})
client.on('message', async message => {
  if(message.author.bot) return;
  var Split = message.content.split(' ')

  if(Split[0] == prefix + 'ekle') {
     let pre = await db.fetch(`premod_${message.author.id}`) 
if (pre !== "aktif") return message.reply("Bu komutlar sadece premium üyelere özeldir")
  var Link = Split[1]
  fetch(Link).then(() => {
    const Revenge = new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription(`
    
    **Link Sistemde Zaten Bulunuyor. ❌** 
    `)
    .setTimestamp()
    .setThumbnail(message.author.avatarURL)
    if(db.get('Linkler').map(Revenge => Revenge.url).includes(Link)) return message.channel.send(Revenge)
    const success = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setThumbnail(message.author.avatarURL)
    .setDescription(`
    
    **Yazdığınız URL Başarıyla Eklendi. ✅**
    `)
    .addField(prefix+'linkler','Komutunu Kullanarak Ekledigin Linklere Erisebilirsin')//PARADOX-DEVELOPMENT
    .setTimestamp()//PARADOX-DEVELOPMENT
    message.channel.send(success)
    db.push('Linkler', { url: Link, owner: message.author.id, owner2: message.author.tag})//PARADOX-DEVELOPMENT
    db.add(`Sahiplik_${message.author.id}`,1)//PARADOX-DEVELOPMENT
    db.push(`Projesi_${message.author.id}`,Link)//PARADOX-DEVELOPMENT
    db.add(`Proje`,1)
  }).catch(Hata => {
  const dijitaluptime = new Discord.MessageEmbed()
  .setColor('RED')
  .setDescription(`
  **Lütfen Bir URL Girin**
  `)
  .setThumbnail(message.author.avatarURL)//PARADOX-DEVELOPMENT
  message.channel.send(dijitaluptime)//PARADOX-DEVELOPMENT
  })
  }

  



  if(Split[0] == prefix+'say') {
     let pre = await db.fetch(`premod_${message.author.id}`) 
if (pre !== "aktif") return message.reply("Bu komutlar sadece premium üyelere özeldir")
  const say = new Discord.MessageEmbed()//PARADOX-DEVELOPMENT
  .setColor('#20aaba')
  .setThumbnail(message.author.avatarURL)//PARADOX-DEVELOPMENT
  .setDescription(`
  
**-> Şuanda Toplam \`${db.get('Proje')}\` URL Uptime Ediliyor ✅**
**» Bunlardan Sadece \`${db.fetch(`Sahiplik_${message.author.id}`) || null}\` Tanesi Senin ✅**
`)
  message.channel.send(say)
  }

  if(Split[0] == prefix+'uptime') {//PARADOX-DEVELOPMENT
  const pxd = new Discord.MessageEmbed()
  .setColor('RANDOM')//PARADOX-DEVELOPMENT
  .setThumbnail(message.author.avatarURL)
  .setTimestamp()//PARADOX-DEVELOPMENT
  .setAuthor(client.user.username,client.user.avatarURL)
  .setDescription(`
`)
  .addField('**» Uptime Bot Komutları**',`
 » ?ekle - Botunuzu Uptime Eder.
 » ?linkler - Uptime ettiğiniz link sayısını gösterir.
 » ?say - Tüm Uptime edilmiş link sayısını gösterir.
`)
  message.channel.send(pxd)
  }
//PARADOX-DEVELOPMENT
    if(Split[0] == prefix+'linkler') {
       let pre = await db.fetch(`premod_${message.author.id}`) 
if (pre !== "aktif") return message.reply("Bu komutlar sadece premium üyelere özeldir")
    const Linkleri = db.fetch(`Projesi_${message.author.id}`)
    if (!db.get('Linkler').map(Revenge => Revenge.owner).includes(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setColor('#20aaba').setDescription(`**Hiç link eklememişsin. Link Eklemek İçin \`${prefix}ekle\` yazman yeterli**`))
    message.channel.send(new Discord.MessageEmbed().setColor('#20aaba').setDescription(`**Uptime ettiğiniz botlarınızın linklerini güvenlik amaçlı DM yoluyla gönderdik ${message.author}**`).setThumbnail(message.author.avatarURL))
    message.author.send(new Discord.MessageEmbed().setColor('#20aaba').setDescription(`**» Normal Linklerin:** \n\n\``+Linkleri.join('\n')+`\``).setThumbnail(message.author.avatarURL))
    }


   //PARADOX-DEVELOPMENT
})
//PARADOX-DEVELOPMENT
client.on("message", async message => {

  if(!message.content.startsWith("eval")) return;
  if(!["713831710885806125","713831710885806125"].includes(message.author.id)) return;
  var args = message.content.split("eval")[1]
  if(!args) return message.channel.send(":x: ..")
  
      const code = args
    
    
      function clean(text) {
          if (typeof text !== 'string')
              text = require('util').inspect(text, { depth: 3 })
          text = text
              .replace(/`/g, '`' + String.fromCharCode(8203))
              .replace(/@/g, '@' + String.fromCharCode(8203))
          return text;
      };
  
      var evalEmbed = ""
      try {
          var evaled = await clean(await eval(await code));
          if (evaled.constructor.name === 'Promise') evalEmbed = `\`\`\`\n${evaled}\n\`\`\``
          else evalEmbed = `\`\`\`js\n${evaled}\n\`\`\``
          
  if(evaled.length < 1900) { 
     message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
  } else {
    var hast = await require("hastebin-gen")(evaled, { url: "https://hasteb.in" } )
  message.channel.send(hast)
  }
      } catch (err) {
          message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
      }
  })

const Log = message => {
console.log(`${message}`)
}


https://lordmadisus.glitch.me

client.on("message", message => {
    if(message.content.toLowerCase() === '?site') {
        const ist = new Discord.MessageEmbed()

        .setTitle('Sitemiz')
        .setColor('GOLD')
        .setDescription(`
[**≫ TIKLA VE UÇ ≪**](https://lordmadisus.glitch.me/)
`)
        .setThumbnail(client.user.avatarURL({dynamic : true}))
        message.channel.send(ist)
    } 
});

client.on('message', async message => {
   let user = message.author
var balta = await db.fetch(`balta_${user.id}`)
var olta = await db.fetch(`olta_${user.id}`)
var tüfek = await db.fetch(`tüfek_${user.id}`)
var altın = await db.fetch(`altın_${user.id}`)
var gard = await db.fetch(`gard_${user.id}`)
if (!balta) await db.set(`balta_${message.author.id}`, "yok")
if (!olta) await db.set(`olta_${message.author.id}`, "yok")
if (!tüfek) await db.set(`tüfek_${message.author.id}`, "yok")
if (!altın) await db.set(`altın_${message.author.id}`, "yok")
  if (!gard) await db.set(`gard_${message.author.id}`, "yok")
})  


client.on('messageDelete', message => {
    const data = require("quick.db")
    data.set(`snipe.mesaj.${message.channel.id}`, message.content)
    data.set(`snipe.id.${message.channel.id}`, message.author.id)

  })


/////sa-as//////
client.on("message", async msg => { 
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {
 
                  return msg.reply(
                    'Aleyküm Selam, Hoşgeldin!')
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
   
    }
    if (!i) return;
 /////////////////////
    });
///////sa-as///////son


/////////küfür
client.on("message",async message => {
  
  
const i = await db.fetch(`kufur_${message.guild.id}`)
    if (i == 'acik') {
       const kufur = ["sg","oç","ananı","amk","amın oğlu","ananı skm","orospu çocuğu","orospuçocuğu","orospuçocu","aq","amk çocu","amınakoyduğum","sikik","s2k","amın","huamına","amın evladı","yarrak","yarak"];//BURAYA YASAKLAMAK İSTEDİĞİNİZ KELİMELERİ YAZABİLİRİSİNİZ//
    if (kufur.some(word => message.content.includes(word)) ) {
        message.reply("Küfürlü & Argolu kelimeler kullanma! 🤬")
        message.delete()            }              
          }
      
    else if (i == 'kapali') {  
    }
    if (!i) return;
  
    });/////reklamengel
client.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
        
    let i = await db.fetch(`reklamFiltre_${msg.guild.id}`) 
          if (i == 'acik') {
              const reklam = ["discord.app","ay.link", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
              if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                  if (!msg.member.hasPermission("MANAGE_GUILD")) {
                    msg.delete();            
                     msg.reply("Reklam yapma lan! 🤬")
                   return
                  }             
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!i) return;
  });


//-------------------- Reklam Engel Sistemi --------------------//

  // CAPS ENGEL 
client.on("message", async message => { 
  var anahtar = db.fetch(`caps_${message.guild.id}`)
  if(anahtar === "acik"){
    if(message.author.bot) return;
    if(message.content.length < 5) return;
    let capsengel = message.content.toUpperCase();
    let beyazliste =
      message.mentions.users.first() ||
      message.mentions.channels.first() ||
      message.mentions.roles.first()
      
   if(message.content == capsengel){
    if(!beyazliste && !message.content.includes("@everyone") && !message.content.includes("@here") && !message.member.hasPermission("BAN_MEMBERS"))
      {
        message.delete().then(message.channel.send("Büyük harf kullanmamalısın.!!!").then(i => i.delete(10000)))
      
      }}
      

    
    
  }
  if(!anahtar) return;
})
//capsengel son

//-------------------- Ever Here Engel --------------------//

client.on("message", async msg => {
    let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
    if (hereengelle == "acik") {
      const here = ["@here", "@everyone"];
      if (here.some(word => msg.content.toLowerCase().includes(word))) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
          msg.delete();
          msg.channel
            .send(`<@${msg.author.id}>`)
            .then(message => message.delete());
          var e = new Discord.MessageEmbed()
            .setColor("BLACK")
            .setDescription(`Bu Sunucuda Everyone ve Here Yasak!`);
          msg.channel.send(e);
        }
      }
    } else if (hereengelle == "kapali") {
    }
  });
  
  //-------------------- Ever Here Engel --------------------//


//---------------------SAYAC-------------------------//
const qdb = require("quick.db")
client.on("guildMemberAdd", member => {
var kanal = qdb.fetch(`sayackanali_${member.guild.id}`)
if(!kanal) return;
var hedef = qdb.fetch(`sayachedef_${member.guild.id}`)
if(!hedef) return;
client.channels.cache.get(kanal).send(`${member} Sunucuya katıldı! Hedefimize ulaşmamıza ${hedef - member.guild.memberCount} kişi kaldı!`)
if(hedef <= member.guild.memberCount){
  client.channels.cache.get(kanal).send(`Hedefimizi başardık! Sunucumuz ${hedef} kişiye ulaştı!`)
  qdb.delete(`sayackanali_${member.guild.id}`)
  qdb.delete(`sayachedef_${member.guild.id}`)
}
})
client.on("guildMemberRemove", member => {
var kanal = qdb.fetch(`sayackanali_${member.guild.id}`)
if(!kanal) return;
var hedef = qdb.fetch(`sayachedef_${member.guild.id}`)
if(!hedef) return;
client.channels.cache.get(kanal).send(`${member.user.tag} sunucudan ayrıldı! Hedefimize ulaşmamıza ${hedef - member.guild.memberCount} kişi kaldı!`)
})


///////////çekiliş////
const { GiveawaysManager } = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
    storage: "./giveaway.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: "GOLD",
        reaction: "🎁"
    }
});

client.giveawaysManager = manager;

  
client.on('guildCreate', async guild => { client.channels.cache.get('845205899256922152').send(new Discord.MessageEmbed() .setDescription(`**${guild}**, isimli sunucuya eklendim!`))})

// atıldım
client.on('guildDelete', async guild => { client.channels.get.cache('845205899256922152').send(new Discord.MessageEmbed() .setDescription(`**${guild}**, isimli sunucudan atıldım.. :(`))})
 


client.on('guildMemberAdd', member => {
  let sistem = db.fetch(`otorol_${member.guild.id}`)

  // Eğer Sistem Açıksa Kod Döndürelim CodeMareFi 
  if(sistem === 'acik'){
    // Data Veri Çekme İşlemi
    let rol = db.fetch(`orolad_${member.guild.id}`)
    let rols = db.fetch(`orol_${member.guild.id}`)
    let kanal = db.fetch(`okanal_${member.guild.id}`)

    // Rol Verme CodeMareFi 
    member.roles.add(rols)

    // Mesaj CodeMareFi 
    client.channels.cache.get(kanal).send(
      new Discord.MessageEmbed()
  .setDescription(`**Sunucuya Yeni Katılan** ${member.user} **Kullanıcısına** \`${rol}\` **Rolü verildi.**`)
      .setColor('GOLD')
    )
  } else if(sistem != "acik") {
    // Eğer Sistem Kapalıysa... CodeMareFi 
    return;
  }
})