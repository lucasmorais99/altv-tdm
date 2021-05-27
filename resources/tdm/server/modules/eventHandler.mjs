import * as alt from 'alt';
import * as chat from 'chat';
import * as helper from './helper.mjs';
import * as clientEvent from './clientEventHandler.mjs'
import * as markerManager from 'altv-os-marker-manager';
import { spawns } from './lists.mjs'
import { spawnModels } from './lists.mjs'
import { weaponsHash } from './lists.mjs'


// Player Connect & Spawn Handler
alt.on('playerConnect', function (player) {
    if (player.name.includes("admin")) {
        player.kick();
        return;
    }
    alt.emitClient(player, "freeroam:switchInOutPlayer", false, 0, 1);
    player.model = spawnModels[helper.getRandomListEntry(spawnModels)];
    player.setMeta("vehicles", []);

    markerManager.createMarker(20,
        new alt.Vector3(170.74, -1723.23, 20.4), // position
        new alt.Vector3(0, 0, 0), // Marker direction
        new alt.Vector3(0, 0, 0), // Marker rotation
        new alt.Vector3(1, 1, 1), // Marker scale
        new alt.RGBA(255, 0, 0, 255), // Marker color
        {} // Marker options (Read "Creating a marker")
    )

    markerManager.createMarker(20,
        new alt.Vector3(68.9, -1569.9, 20.6), // position
        new alt.Vector3(0, 0, 0), // Marker direction
        new alt.Vector3(0, 0, 0), // Marker rotation
        new alt.Vector3(1, 1, 1), // Marker scale
        new alt.RGBA(255, 0, 0, 255), // Marker color
        {} // Marker options (Read "Creating a marker")
    )

    markerManager.createMarker(20,
        new alt.Vector3(360.7, -1584.5, 29.3), // position
        new alt.Vector3(0, 0, 0), // Marker direction
        new alt.Vector3(0, 0, 0), // Marker rotation
        new alt.Vector3(1, 1, 1), // Marker scale
        new alt.RGBA(255, 0, 0, 255), // Marker color
        {} // Marker options (Read "Creating a marker")
    )

    //var spawn = spawns[helper.getRandomListEntry(spawns)];
   // player.spawn(spawn.x, spawn.y, spawn.z, 0);
    alt.emitClient(player, "freeroam:spawned");
    alt.emitClient(player, "freeroam:Interiors");

    setTimeout(function () {
        if (player !== undefined) {
            let playerCount = alt.Player.all.length;
            chat.broadcast(`{1cacd4}${player.name} {ffffff}entrou no servidor. Atualmente:  (${playerCount} player(s) online)`);
            chat.send(player, "{80eb34}Pressione {34dfeb}T {80eb34}e digite {34dfeb}/ajuda {80eb34}para ver os comandos disponíveis.");
            chat.send(player, "{80eb34}Selecione a sua equipe.");
            alt.emitClient(player, "teamSelection");
        }
    }, 1000);
});

// Player Disconnect Handler
alt.on('playerDisconnect', (player, reason) => {
    let playerCount = alt.Player.all.length;
    chat.broadcast(`{1cacd4}${player.name} {ffffff}has {ff0000}left {ffffff}the Server.. (${playerCount} players online)`);
    player.getMeta("vehicles").forEach(vehicle => {
        if (vehicle != null) {
            vehicle.destroy();
        }
    });
    player.setMeta("vehicles", undefined);
    alt.log(`${player.name} has leaved the server becauseof ${reason}`);
});

// Player Death Handler
alt.on('playerDeath', (player, killer, weapon) => {
    var spawn = spawns[helper.randomNumber(0, spawns.length - 1)];
    alt.emitClient(player, "freeroam:switchInOutPlayer", false, 0, 2);
    setTimeout(function () {
        if (player !== undefined) {
            if (clientEvent.playerTeam == 'Ballas') {
                player.spawn(176.43, -1736.61, 31, 0);
                alt.emitClient(player, "freeroam:switchInOutPlayer", true);
                alt.emitClient(player, "freeroam:clearPedBloodDamage");
            }
            else if (clientEvent.playerTeam == 'Vagos') {
                player.spawn(61.33, -1567, 29.44, 0);
                alt.emitClient(player, "freeroam:switchInOutPlayer", true);
                alt.emitClient(player, "freeroam:clearPedBloodDamage");
            }
            else if (clientEvent.playerTeam == 'LSPD') {
                player.spawn(380.67, -1580.83, 29.27, 0);
                alt.emitClient(player, "freeroam:switchInOutPlayer", true);
                alt.emitClient(player, "freeroam:clearPedBloodDamage");
            }
        }
    }, 3000);
    alt.log(`${killer.name} gave ${player.name} the rest!`);
    chat.broadcast(`Hash arma 1: ${weapon}`);
    var weaponLog = JSON.stringify(weaponsHash[weapon]);
    chat.broadcast(`${weaponLog}`);
    weapon = weaponsHash[weapon];
    chat.broadcast(`Hash arma 2: ${weaponsHash[weapon]}`);
    helper.SendNotificationToAllPlayer(`~r~<C>${killer.name}</C> ~s~matou ~b~<C>${player.name}</C> usando ${weapon}`);
});