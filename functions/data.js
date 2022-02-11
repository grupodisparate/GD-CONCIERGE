const fs = require('fs')

function createFile(datafile){
    fs.writeFileSync(("./"+datafile), ("{}"));
  }
  
  function loadData(datafile){
    if (!fs.existsSync("./"+(datafile))){
      console.log("Creating file!", datafile);
      createFile(datafile)
      let datajson = JSON.parse(fs.readFileSync("./"+(datafile), 'utf8'));
      saveData(datafile, datajson);
      let datajson2 = JSON.parse(fs.readFileSync("./"+(datafile), 'utf8'));
      return datajson2;
    } else{
      let datajson = JSON.parse(fs.readFileSync("./"+(datafile), 'utf8'));
      return datajson;
    }
  }
  
  function saveData(datafile, data){
    fs.writeFileSync("./"+(datafile), JSON.stringify(data, null, 2));
    //console.log("Pre-saved!", datafile)
    var dataverify = loadData(datafile);
    fs.writeFileSync("./"+(datafile), JSON.stringify(dataverify, null, 2));
    console.log("Saved!", datafile)
  }

  async function updateData(client, guildId, datafile){
    let data = loadData(datafile);
    if(!data.members){
        data.members = {};
        saveData(datafile, data);
    }
    const guild = await client.guilds.cache.get(guildId);
    guild.members.cache.each(member => {
        if(member.user.bot) return;
        if(!data.members[member.user.id]){
            console.log("New member!", member.user.username);
            data.members[member.user.id] = {
                "id": member.user.id,
                "name": member.user.username,
                "welcomed": false
            }
            saveData(datafile, data);
        }
    });
}

async function newMemberUpdateData(client, member, guildId, datafile){
    let data = loadData(datafile);
    if(member.user.bot) return;
    if(!data.members){
        data.members = {};
        saveData(datafile, data);
    }
    if(!data.members[member.user.id]){
        console.log("New member!", member.user.username);
        data.members[member.user.id] = {
            "id": member.user.id,
            "name": member.user.username,
            "welcomed": false
        }
        saveData(datafile, data);
    }
}

  module.exports = {
    loadData: loadData,
    saveData: saveData,
    updateData: updateData
};