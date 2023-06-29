export function getFullCarac(carac){
    let result = "";

    switch(carac) {
      case 'for':
        result = 'force';
        break;

      case 'agi':
        result = 'agilite';
        break;

      case 'cbt':
        result = 'combativite';
        break;

      case 'sns':
        result = 'sensibilite';
        break;

      case 'end':
        result = 'endurance';
        break;

      case 'dex':
        result = 'dexterite';
        break;

      case 'int':
        result = 'intelligence';
        break;

      case 'prs':
        result = 'presence';
        break;
    }

    return result;
}

export async function rollStd(actor, name, score, data=undefined) {
  const optDices = game.settings.get("mutants-and-masterminds-3e", "typeroll")
  const target = game.user.targets.ids[0];
  const baseCrit = optDices === '3D6' ? 18 : 20;
  let dices = `1D20`;
  let pRoll = {};

  if(optDices === '3D20') dices = '3D20dldh';
  else if(optDices === '3D6') dices = '3D6';

  // GESTION D'UN JET D'ATTAQUE
  if(data !== undefined && target !== undefined) {
    const dataCbt = data.attaque;
    const dataStr = data.strategie;

    const formula = `${dices} + ${score} + ${dataStr.attaque}`;      
    const roll = new Roll(formula);
    roll.evaluate({async:false});
    
    const token = canvas.scene.tokens.find(token => token.id === target);
    const tokenData = token.actor.system;

    const resultDie = roll.total-score-dataStr.attaque;

    const parade = Number(tokenData.ddparade);
    const esquive = Number(tokenData.ddesquive);
    const ddDefense = dataCbt.type === 'combatcontact' ? parade : esquive;
    const traType = dataCbt.type === 'combatcontact' ? game.i18n.localize("MM3.DEFENSE.DDParade") : game.i18n.localize("MM3.DEFENSE.DDEsquive");
    
    const saveType = dataCbt.save;
    
    if((roll.total >= ddDefense && resultDie !== 1) || resultDie >= dataCbt.critique) {
      pRoll = {
        flavor:`${name}`,
        tooltip:await roll.getTooltip(),
        formula:optDices === '3D20' ? `3D20 + ${score}` : formula,
        result:roll.total,
        isCombat:true,
        isSuccess:true,
        defense:ddDefense,
        isCritique:resultDie >= dataCbt.critique ? true : false,
        type:traType,
        text:dataCbt.text,
        btn:{
          target:target,
          saveType:saveType,
          vs:saveType === 'robustesse' ? Number(dataCbt.effet)+Number(dataStr.effet)+15 : Number(dataCbt.effet)+Number(dataStr.effet)+10,
        }
      };

      const rollMsgData = {
        user: game.user.id,
        speaker: {
          actor: actor?.id || null,
          token: actor?.token?.id || null,
          alias: actor?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls:[roll],
        content: await renderTemplate('systems/mutants-and-masterminds-3e/templates/roll/std.html', pRoll),
        sound: CONFIG.sounds.dice
      };
    
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);
    
      await ChatMessage.create(msgData, {
        rollMode:rMode
      });

      /**/
    } else {
      pRoll = {
        flavor:`${name}`,
        tooltip:await roll.getTooltip(),
        formula:optDices === '3D20' ? `3D20 + ${score}` : formula,
        result:roll.total,
        isCombat:true,
        isSuccess:false,
        defense:ddDefense,
        type:traType,
        text:dataCbt.text
      };

      const rollMsgData = {
        user: game.user.id,
        speaker: {
          actor: actor?.id || null,
          token: actor?.token?.id || null,
          alias: actor?.name || null,
        },
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        rolls:[roll],
        content: await renderTemplate('systems/mutants-and-masterminds-3e/templates/roll/std.html', pRoll),
        sound: CONFIG.sounds.dice
      };
    
      const rMode = game.settings.get("core", "rollMode");
      const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);
    
      await ChatMessage.create(msgData, {
        rollMode:rMode
      });
    }
  } else if(data !== undefined) {
    const dataCbt = data.attaque;
    const dataStr = data.strategie;

    const formula = `${dices} + ${score} + ${dataStr.attaque}`;      
    const roll = new Roll(formula);
    roll.evaluate({async:false});

    const resultDie = roll.total-score-dataStr.attaque;

    pRoll = {
      flavor:`${name}`,
      tooltip:await roll.getTooltip(),
      formula:optDices === '3D20' ? `3D20 + ${score}` : formula,
      result:roll.total,
      isCritique:resultDie >= dataCbt.critique ? true : false,
      text:dataCbt.text
    };

    const rollMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls:[roll],
      content: await renderTemplate('systems/mutants-and-masterminds-3e/templates/roll/std.html', pRoll),
      sound: CONFIG.sounds.dice
    };
  
    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);
  
    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  } else {
    // GESTION DES AUTRES JETS
    const formula = `${dices} + ${score}`;      
    const roll = new Roll(formula);
    roll.evaluate({async:false});

    const resultDie = roll.total-score;

    pRoll = {
      flavor:`${name}`,
      tooltip:await roll.getTooltip(),
      formula:optDices === '3D20' ? `3D20 + ${score}` : formula,
      result:roll.total,
      isCritique:resultDie >= baseCrit ? true : false,
    };

    const rollMsgData = {
      user: game.user.id,
      speaker: {
        actor: actor?.id || null,
        token: actor?.token?.id || null,
        alias: actor?.name || null,
      },
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls:[roll],
      content: await renderTemplate('systems/mutants-and-masterminds-3e/templates/roll/std.html', pRoll),
      sound: CONFIG.sounds.dice
    };
  
    const rMode = game.settings.get("core", "rollMode");
    const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);
  
    await ChatMessage.create(msgData, {
      rollMode:rMode
    });
  }
}

export async function rollPwr(actor, id) {
  const optDices = game.settings.get("mutants-and-masterminds-3e", "typeroll");
  const pwr = actor.items.filter(item => item.id === id)[0];
  const type = pwr.system.special;
  const rang = type === 'dynamique' ? actor.system.pwr[id].cout.rang : pwr.system.cout.rang;
  const name = pwr.name;
  const baseCrit = optDices === '3D6' ? 18 : 20;
  let dices = `1D20`;

  if(optDices === '3D20') dices = '3D20dldh';
  else if(optDices === '3D6') dices = '3D6';

  const formula = `${dices} + ${rang}`;      
  const roll = new Roll(formula);
  roll.evaluate({async:false});
  const resultDie = roll.total-rang;

  const pRoll = {
    flavor:`${name}`,
    tooltip:await roll.getTooltip(),
    formula:optDices === '3D20' ? `3D20 + ${rang}` : formula,
    result:roll.total,
    isCritique:resultDie >= baseCrit ? true : false,
    action:pwr.system.action,
    portee:pwr.system.portee,
    duree:pwr.system.duree,
    descripteurs:pwr.system.descripteur,
    description:pwr.system.description,
    effet:pwr.system.effet
  };

  const rollMsgData = {
    user: game.user.id,
    speaker: {
      actor: actor?.id || null,
      token: actor?.token?.id || null,
      alias: actor?.name || null,
    },
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    rolls:[roll],
    content: await renderTemplate('systems/mutants-and-masterminds-3e/templates/roll/pwr.html', pRoll),
    sound: CONFIG.sounds.dice
  };

  const rMode = game.settings.get("core", "rollMode");
  const msgData = ChatMessage.applyRollMode(rollMsgData, rMode);

  await ChatMessage.create(msgData, {
    rollMode:rMode
  });
}