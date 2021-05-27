import * as alt from 'alt';
import * as chat from 'chat';
import { weapons } from './lists.mjs';

chat.registerCmd("ajuda", function (player, args) {
    chat.send(player, "{ff0000}========== {eb4034}AJUDA {ff0000} ==========");
    chat.send(player, "{ff0000}= {34abeb}/veh {40eb34}(modelo)   {ffffff} Spawna um veículo");
    chat.send(player, "{ff0000}= {34abeb}/ir {40eb34}(targetPlayer)   {ffffff} Teleporta até o jogador alvo");
    chat.send(player, "{ff0000}= {34abeb}/skin {40eb34}(modelName)   {ffffff} Muda seu ped");
    chat.send(player, "{ff0000}= {34abeb}/dararma {40eb34}(weaponName)   {ffffff} Pegar uma arma específica");
    chat.send(player, "{ff0000}= {34abeb}/armas    {ffffff} Pegar todas as armas");
    chat.send(player, "{ff0000} ========================");
});

chat.registerCmd("veh", function (player, args) {
    if (args.length === 0) {
        chat.send(player, "Usage: /veh (veículo)");
        return;
    }
    try {
        var vehicle = new alt.Vehicle(args[0], player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    } catch {
        chat.send(player, `{ff0000} Este veículo {ff9500}${args[0]} {ff0000}não existe.`);
    } finally {
        var pvehs = player.getMeta("vehicles");
        if (pvehs.length >= 3) {
            var toDestroy = pvehs.pop();
            if (toDestroy != null) {
                toDestroy.destroy();
            }
        }
        pvehs.unshift(vehicle);
        player.setMeta("vehicles", pvehs);
    }
});

chat.registerCmd("andar", function (player) {
    alt.emitClient(player, "andar")
});

chat.registerCmd("pos", function (player, args) {
    alt.log(`Position: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
    chat.send(player, `Position: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
});

chat.registerCmd("ir", function (player, args) {
    if (args.length === 0) {
        chat.send(player, "Usage: /ir (alvo)");
        return;
    }
    let players = alt.getPlayersByName(args.join(' '));
    if (players.length === 0) {
        chat.send(player, `{ff0000} Player {ff9500}${args.join(' ')} {ff0000}not found..`);
    } else {
        player.pos = players[0].pos;
    }
});

chat.registerCmd("skin", function (player, args) {
    if (args.length === 0) {
        chat.send(player, "Usage: /skin (modelo)");
        return;
    }
    player.model = args[0];
});

chat.registerCmd("dararma", function (player, args) {
    if (args.length === 0) {
        chat.send(player, "Usage: /dararma (modelName)");
        return;
    }
    player.giveWeapon(alt.hash("weapon_" + args[0]), 500, true);
});

chat.registerCmd("weapons", function (player, args) {
    weapons.forEach(element => {
        player.giveWeapon(alt.hash("weapon_" + element), 500, true);
    });
});

chat.registerCmd("time", function (player, args) {
    alt.emitClient(player, "freeroam:switchInOutPlayer", false, 0, 1);
    chat.send(player, "{80eb34}Selecione a sua equipe.");
    setTimeout(() => {
        alt.emitClient(player, "teamSelection");
    }, 1000);
});