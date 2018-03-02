const { Client, Util } = require('discord.js');
const Discord = require('discord.js');
const random = require('randomize');
const moment = require('moment');
require('moment-duration-format');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fetchGifs = require("fetch-gifs");
const fetch = require('fetch');
const gifSearch = require('gif-search');
const settings = require('./config/settings.json');
const id_db = require('./config/id_db.json');
const cinputs = require('./extfi/colorinp.json');
const client = new Client({ disableEveryone: true });

const prefix = settings.prefix;
const token = settings.token;
const owner = id_db.owner;
const evplanners = id_db.evplanners;
const admins = id_db.admins;
const mods = id_db.mods;
const trusted = id_db.trusted;
const subowners = id_db.subowners;
const mvncolors = cinputs.mvncolors;
const botid = '388746505923723275'

const youtube = new YouTube('AIzaSyBg7bCPSPce5ItCMwMuRm6yzPPVt8rPDUc');

const queue = new Map();

client.on('ready', () => {
  console.log(' ');
  console.log('Online and functional!');
    client.user.setPresence(
      {game:
        {name: prefix + 'help',
         url: 'https://www.twitch.tv/NaN'}
      });
});



client.on('message', (message) => {

  if (message.author.bot) return undefined;

  const args = message.content.split(' ');
  const guild = message.guild;

      //util commands

  if (message.content.startsWith(settings.prefix + "ping")) {
    message.channel.send(":ping_pong:   ||   `" + `${new Date().getTime() - message.createdTimestamp}` + "` ms");
    message.delete();
  }

  if (message.content == prefix + 'serverinfo' || message.content == prefix + 'sinfo') {
    var embed = new Discord.RichEmbed()
      .setAuthor(guild.name, guild.iconURL)
      .setThumbnail(guild.iconURL)
      .setFooter('Created ' + moment.duration(Date.now() - guild.createdTimestamp).format('d [days,] h [hours,] m [minutes,] s [seconds]') + ' ago!')
      .addField('Region', guild.region, true)
      .addField('ID', guild.id, true)
      .addField('Members [' + guild.memberCount + ']', '**»** Humans - ' + `${guild.memberCount - guild.members.filter(m => m.user.bot).array().length}` + '\n**»** Bots - ' + guild.members.filter(m => m.user.bot).array().length, true)
      .addField('Presences', '<:online:405909125730533376> ' + guild.members.filter(m => m.user.presence.status === 'online').array().length + '  |<:offline:405911325638918155> ' + guild.members.filter(m => m.user.presence.status === 'offline').array().length + '\n<:dnd:405911325651238913> ' + guild.members.filter(m => m.user.presence.status === 'dnd').array().length + '  |<:idle:405911325609295893> ' + guild.members.filter(m => m.user.presence.status === 'idle').array().length, true)
      .addField('Server Owner', guild.owner.user.tag + ' (`' + guild.ownerID + '`)')
      .addField('Channels [' + guild.channels.array().length + ']', 'Text: ' + guild.channels.filter(c => c.type === "text").size + '\nVoice: ' + guild.channels.filter(c => c.type === "voice").size)
      .addField('Roles [' + guild.roles.array().length + ']', 'To see a full list of roles, use `' + prefix + 'roles`!')
    message.channel.send({embed})
  }

  if (message.content == prefix + 'roles') {
    const embed = new Discord.RichEmbed()
      .setDescription('```' + message.guild.roles.map(r => r.name).join(', ') + '```')
    message.channel.send({embed});
  }

  if (message.content == client.user) {
    message.channel.send(":speech_balloon:  Hm? Do you need anything?")
  };

  if (message.content == prefix + 'coinflip') {
    var choices = ['heads','tails']
    var chinp = Math.floor(Math.random() * choices.length);

    message.channel.send(choices[chinp])
  }

  if (message.content.startsWith(prefix + 'giftest')) {
    gifSearch.random(altArgs[1]).then(gifUrl => message.channel.send(gifUrl))
  }

      //dev commands

  if (message.content == prefix + 'refresh' && message.author.id === owner) {
    message.channel.send(':repeat: Restarting now...').then(m => {
      process.exit()
    });
  }

      //server-specific commands

  if (message.content.startsWith(prefix + 'mvnight') && message.author.id === owner || message.author.id === admins || message.author.id === evplanners || message.author.id === subowners) {

    if (!args[1]) {
      var embed = new Discord.RichEmbed()
        .setAuthor('Hmm... It looks like you didn\'t provide an image link.')
        .setDescription('**Correct Usage:**\n`' + prefix + 'mvnight [image link] [rabb.it link] [description]`')
        .setFooter('*Note: You must include an actual image link, otherwise the command will not work.')
      message.channel.send({embed});
   } else if (!args[1].includes('http')) {
     var embed = new Discord.RichEmbed()
        .setAuthor('Hmm... You need to provide an image link.')
        .setDescription('**Correct Usage:**\n`' + prefix + 'mvnight [image link] [rabbit.it] [description]`')
      message.channel.send({embed});
    } else if (!args[2]) {
      var embed = new Discord.RichEmbed()
        .setAuthor('Hmm... It looks like you didn\'t provide a rabb.it link.')
        .setDescription('**Correct Usage:**\n`' + prefix + 'mvnight [image link] [rabb.it link] [description]`')
        .setFooter('*Note: You must include an actual rabb.it link, otherwise the command will not work.')
      message.channel.send({embed})
    } else if (!args[2].includes('http')) {
      var embed = new Discord.RichEmbed()
         .setAuthor('Hmm... You need to provide a rabb.it link.')
         .setDescription('**Correct Usage:**\n`' + prefix + 'mvnight [image link] [rabbit.it] [description]`')
       message.channel.send({embed});
    } else if (args[1]) {
      var embed = new Discord.RichEmbed()
        .setAuthor('Movie Time!', 'https://j.gifs.com/vWrB16.gif')
        .setDescription(message.content.slice(9 + args[1].length + 1 + args[2].length + 1 + 1, message.content.length))
        .setThumbnail(args[1])
        .addField('Movie Link', args[2])
        .setFooter('We\'ll be starting soon, so make sure you grab your popcorn and, of course, have fun!', 'https://www.rabb.it/static/comment201712081630/rabbit/img/rabbit-logo-share.png')
        .setColor(random(mvncolors))
      message.channel.send({embed});
    }
  }

      //fun commands

  if (message.content.startsWith(settings.prefix + "say")) {
    message.delete();
    message.channel.send(message.content.slice(6, message.content.length));
  }

  if (message.content.startsWith(settings.prefix + "esay")) {
    message.delete();
    var embed = new Discord.RichEmbed()
      .setDescription(message.content.slice(7, message.content.length))
    message.channel.send({embed});
  }

      //mod commands

  if (message.content.startsWith(settings.prefix + "purge")) {
  const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
    if (!amount) return message.channel.send('<:red_x:359115212877594627> Specify an amount to delete!');
      message.channel.fetchMessages({
        limit: amount + 1,
      }).then((messages) => {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
      }});

      if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.send("<:red_x:359115212877594627> You do not have the permissions to do this!")
      } else {
        message.channel.send(":wastebasket: Deleted **" + amount + "** messages!").then(m => m.delete(5000))
        message.delete()
  }}

  /*if (message.content.startsWith(prefix + 'embed')) {
    var embed = new Discord.RichEmbed()
      .setDescription('**Below you can see the self-assignable role categories and every self-assignable role for the server. Use this channel to assign yourself some roles.**\n\n**Also, to get the nsfw role, please ask one of the online staff members to assign it.**')
      .addField('Gender Roles', '`Male`, `Female`,\n`Nonbinary`', true)
      .addField('Age Roles', '`13-14`, `15-16`,\n`17-18`, `19-20`,\n`21+`', true)
      .addField('Game Roles', '`Overwatch`, `DFO`,\n`League of Legends`,\n`Pokemon`, `osu!`', true)
      .addField('Genral Roles', '`YouTube`, `Artist`,\n`Anime`, `Gamer`, `K-Pop`', true)
      .addField('Sexuality Roles', '`Heterosexual`, `Bisexual`,\n`Gay`, `Pansexual`,\n`Asexual`', true)
      .addField('Notification Roles', '`Partner Notify`,\n`Notify`,\n`Event Notify`', true)
      .addField('Color Roles', '`Magenta`, `Pink`, `Red`, `Orange`, `Yellow`, `Green`, `Blue`, `Indigo`, `Violet`, `Brown`, `Black`, `Light Magenta`, `Light Pink`, `Light Red`, `Light Orange`, `Light Yellow`, `Light Green`, `Light Blue`, `Light Indigo`, `Light Purple`, `Mocha`, `Gray`', true)
      .setFooter('Use ?rank [role] to receive or remove any of the roles mentioned above.')
      .setColor('#ffa68f')
    message.channel.send({embed});
    message.delete();
  }*/

});

client.on('message', async message => {

  if (message.content == prefix + 'rm-g' && message.author.id == owner) {
    var genEmo = [':male_sign:414206118500368385',':female_sign:414206118420807710']
    message.channel.send('𝄀𝄀 **Role Menu** 𝄀𝄀 `Below are all of the roles for genders.`\n\n`Please react to receive or remove one of the roles!`\n\n\n<:male_sign:414206118500368385> :: `Male`\n\n<:female_sign:414206118420807710> :: `Female`').then(async m => {
      await m.react(genEmo[0])
      await m.react(genEmo[1])
    })

    client.on('messageReactionAdd', (messageReaction, user) => {

      if (messageReaction.message.channel.id == '412718248057110530') {

        if (user.id == '388746505923723275') {
            return
        } else if (messageReaction.emoji.id == '414206118500368385') {
            messageReaction.message.guild.members.get(user.id).addRole('413903275335614464');
        } else if (messageReaction.emoji.id == '414206118420807710') {
            messageReaction.message.guild.members.get(user.id).addRole('413903324232810496');
        }
      }
    })

    client.on('messageReactionRemove', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414206118500368385') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903275335614464');
          } else if (messageReaction.emoji.id == '414206118420807710') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903324232810496');
          }
        }
      })
  }

  if (message.content == prefix + 'rm-a' && message.author.id == owner) {
    var ageEmo = [':aa_sym:414682074797309952',':bb_sym:414682074923008000',':cc_sym:414682074453377026',':dd_sym:414682074956562432',':ee_sym:414682074935590922']
      message.channel.send('𝄀𝄀 **Role Menu** 𝄀𝄀 `Below are all of the roles for ages.`\n\n`Please react to receive or remove one of the roles!`\n\n\n<:a_sym:414490510875688960> :: `13 - 14`\n\n<:b_sym:414490510762311681> :: `15 - 16`\n\n<:c_sym:414490510598602754> :: `17 - 18`\n\n<:d_sym:414490510472904717> :: `19 - 20`\n\n<:e_sym:414490510875688980> :: `21+`').then(async m => {
        await m.react(ageEmo[0])
        await m.react(ageEmo[1])
        await m.react(ageEmo[2])
        await m.react(ageEmo[3])
        await m.react(ageEmo[4])
      })

      client.on('messageReactionAdd', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414682074797309952') {
              messageReaction.message.guild.members.get(user.id).addRole('413903640961482772');
          } else if (messageReaction.emoji.id == '414682074923008000') {
              messageReaction.message.guild.members.get(user.id).addRole('413903662365147157');
          } else if (messageReaction.emoji.id == '414682074453377026') {
              messageReaction.message.guild.members.get(user.id).addRole('413903675938045973');
          } else if (messageReaction.emoji.id == '414682074956562432') {
              messageReaction.message.guild.members.get(user.id).addRole('413903698360664065');
          } else if (messageReaction.emoji.id == '414682074935590922') {
            messageReaction.message.guild.members.get(user.id).addRole('413903700738965504');
          }
        }
      })

      client.on('messageReactionRemove', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414682074797309952') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903640961482772');
          } else if (messageReaction.emoji.id == '414682074923008000') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903662365147157');
          } else if (messageReaction.emoji.id == '414682074453377026') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903675938045973');
          } else if (messageReaction.emoji.id == '414682074956562432') {
              messageReaction.message.guild.members.get(user.id).removeRole('413903698360664065');
          } else if (messageReaction.emoji.id == '414682074935590922') {
            messageReaction.message.guild.members.get(user.id).removeRole('413903700738965504');
          }
        }
      })
    }

    if (message.content == prefix + 'rm-m' && message.author.id == owner) {
      var misEmo =[':a_sym:414490510875688960',':b_sym:414490510762311681',':c_sym:414490510598602754',':d_sym:414490510472904717',':e_sym:414490510875688980',':f_sym:414588160014549004',':g_sym:414589365432352789']
      message.channel.send('𝄀𝄀 **Role Menu** 𝄀𝄀 `Below are all of the miscellaneous roles.`\n\n`Please react to receive or remove one of the roles!`\n\n\n<:a_sym:414490510875688960> :: `Gamer`\n\n<:b_sym:414490510762311681> :: `Anime Watcher`\n\n<:c_sym:414490510598602754> :: `K-Pop Listener`\n\n<:d_sym:414490510472904717> :: `Welcomers`\n\n<:e_sym:414490510875688980> :: `Musician`\n\n<:f_sym:414588160014549004> :: `YouTuber`\n\n<:g_sym:414589365432352789> :: `Twitch Streamer`').then(async m => {
        await m.react(misEmo[0])
        await m.react(misEmo[1])
        await m.react(misEmo[2])
        await m.react(misEmo[3])
        await m.react(misEmo[4])
        await m.react(misEmo[5])
        await m.react(misEmo[6])
      })

      client.on('messageReactionAdd', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414490510875688960') {
              messageReaction.message.guild.members.get(user.id).addRole('414533219627565066');
          } else if (messageReaction.emoji.id == '414490510762311681') {
              messageReaction.message.guild.members.get(user.id).addRole('414533730363768834');
          } else if (messageReaction.emoji.id == '414490510598602754') {
              messageReaction.message.guild.members.get(user.id).addRole('414533747614941225');
          } else if (messageReaction.emoji.id == '414490510472904717') {
              messageReaction.message.guild.members.get(user.id).addRole('414586968991858698');
          } else if (messageReaction.emoji.id == '414490510875688980') {
              messageReaction.message.guild.members.get(user.id).addRole('414533660147056640');
          } else if (messageReaction.emoji.id == '414588160014549004') {
              messageReaction.message.guild.members.get(user.id).addRole('414533193165963264');
          } else if (messageReaction.emoji.id == '414589365432352789') {
              messageReaction.message.guild.members.get(user.id).addRole('414533252150329354');
          }
        }
      })

      client.on('messageReactionRemove', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414490510875688960') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533219627565066');
          } else if (messageReaction.emoji.id == '414490510762311681') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533730363768834');
          } else if (messageReaction.emoji.id == '414490510598602754') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533747614941225');
          } else if (messageReaction.emoji.id == '414490510472904717') {
              messageReaction.message.guild.members.get(user.id).removeRole('414586968991858698');
          } else if (messageReaction.emoji.id == '414490510875688980') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533660147056640');
          } else if (messageReaction.emoji.id == '414588160014549004') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533193165963264');
          } else if (messageReaction.emoji.id == '414589365432352789') {
              messageReaction.message.guild.members.get(user.id).removeRole('414533252150329354');
          }
        }
      })
    }

    if (message.channel.id == '412756617130409984' || message.channel.id == '412756647136460810') {

      if (message.author.id == owner || message.author.id == subowners || message.author.id == botid) {
        return
      }

      await message.react(':check_sym:414603866462617630')
      await message.react(':x_sym:414603866487914516')
    }

    if (message.content == prefix + 'rm-n') {
      var notEmo = [':aaa_sym:414683366768508929',':bbb_sym:414683366814908420']
      message.channel.send('𝄀𝄀 **Role Menu** 𝄀𝄀 `Below are all of the notification roles.`\n\n`Please react to receive or remove one of the roles!`\n\n\n<:a_sym:414490510875688960> :: `A. Notify`\n\n<:b_sym:414490510762311681> :: `E. Notify`').then(async m => {
        await m.react(notEmo[0])
        await m.react(notEmo[1])
      })

      client.on('messageReactionAdd', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414683366768508929') {
              messageReaction.message.guild.members.get(user.id).addRole('414607065198231552');
          } else if (messageReaction.emoji.id == '414683366814908420') {
              messageReaction.message.guild.members.get(user.id).addRole('414607105883111434');
          }
        }
      })

      client.on('messageReactionRemove', (messageReaction, user) => {

        if (messageReaction.message.channel.id == '412718248057110530') {

          if (user.id == '388746505923723275') {
              return
          } else if (messageReaction.emoji.id == '414683366768508929') {
              messageReaction.message.guild.members.get(user.id).removeRole('414607065198231552');
          } else if (messageReaction.emoji.id == '414683366814908420') {
              messageReaction.message.guild.members.get(user.id).removeRole('414607105883111434');
          }
        }
      })
    }

  })

client.login(process.env.BOT_TOKEN);
