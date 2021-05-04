import * as alt from 'alt';
import * as extended from 'server-extended'; //https://github.com/team-stuyk-alt-v/altV-Extended
import * as chat from 'chat'; //https://github.com/team-stuyk-alt-v/altV-Chat-Extended
import { skinList } from './skins.mjs';
import * as utility from './utility.mjs';

const spawnLocation = {x: 104.75, y: -1943.61, z: 20.78};
var disconnectedPlayers = new Map();

export function playerFirstJoin(player) {
	// Prevent reconnections to the server to some degree.
	if (disconnectedPlayers.get(player.name)) {
		extended.SetupExportsForPlayer(player);
		player.fadeScreen(true, 5000);
		player.freeze(true);
		disconnectedPlayers.set(player.name, Date.now() + 120000);
		chat.send(player, '{FF0000} You recently disconnected. Please close your game and rejoin.');
		setTimeout(() => {
			player.kick();
		}, 15000);
		return;
	}

	alt.emit('broadcastMessage', `{FFF000}${player.name}{FFFFFF} entrou no servidor.`);
	utility.loadModelForPlayers(player);

	SpawnPlayer(player); 
}

export function playerDisconnect(player) {
	// Remove from dimension if they're in one.
	if (player.currentDimension)
		player.currentDimension.Remove(player);

	// Disconnect the player for 25 seconds.
	disconnectedPlayers.set(player.name, Date.now() + 120000);
}

export function checkDisconnects() {
	disconnectedPlayers.forEach((time, name) => {
		if (Date.now() < time)
			return;

		disconnectedPlayers.delete(name);
		console.log(`===> ${name} is free to rejoin.`);
	});
}

export function respawnPlayer(target) {
	chat.send(target, '{FF0000}Você morreu e retornará ao spawn em breve.');
	const randomPosition = extended.RandomPosAround(spawnLocation, 5);
    
	const skin = target.model;
    
	setTimeout(() => {
		target.spawn(randomPosition.x, randomPosition.y, randomPosition.z);
		target.health = 200;
	}, 4000);
}

function SpawnPlayer(player) {
	const randomPosition = extended.RandomPosAround(spawnLocation, 30);
	const randomModel = Math.floor(Math.random() * skinList.length);
	player.model = 'mp_m_freemode_01';
    
	// Wait to set player health.
	setTimeout(() => {
		player.pos = randomPosition;
		player.health = 200;
	}, 1000);
    
	// Setup for extended / chat
	chat.setupPlayer(player);
	extended.SetupExportsForPlayer(player);
}