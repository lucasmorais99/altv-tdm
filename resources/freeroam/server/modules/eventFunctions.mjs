import * as alt from 'alt';
import * as extended from 'server-extended'; //https://github.com/team-stuyk-alt-v/altV-Extended
import * as chat from 'chat'; //https://github.com/team-stuyk-alt-v/altV-Chat-Extended
import { skinList } from './skins.mjs';
import { skinBallas } from './skins.mjs';
import { skinVagos } from './skins.mjs';
import { skinLSPD } from './skins.mjs';
import { weaponList } from './weapons.mjs';
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
    
	player.dimension = 1;
	
	setTimeout(() => {
		target.spawn(randomPosition.x, randomPosition.y, randomPosition.z);
		target.health = 200;
	}, 4000);
}

export function setPlayerTeam(player, sel) {
	if (sel == 'Ballas'){
		const randomBallas = Math.floor(Math.random() * skinBallas.length);
		player.model = alt.hash(skinBallas[randomBallas]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistol'], 48, false);
		const spawnBallas = { x: 176.43, y: -1736.61, z: 29.27}
		player.pos = extended.RandomPosAround(spawnBallas, 5);
		player.dimension = 0;
	}
	else if (sel == 'Vagos'){
		const randomVagos = Math.floor(Math.random() * skinVagos.length);
		player.model = alt.hash(skinVagos[randomVagos]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistol'], 48, false);
		const spawnVagos = { x: 61.33, y: -1567, z: 29.44}
		player.pos = extended.RandomPosAround(spawnVagos, 5);
		player.dimension = 0;
	}
	else if (sel == 'LSPD'){
		const randomLSPD = Math.floor(Math.random() * skinLSPD.length);
		player.model = alt.hash(skinLSPD[randomLSPD]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistolmk2'], 48, false);
		player.giveWeapon(weaponList['pumpshotgun'], 48, false);
		const spawnLSPD = { x: 359.14, y: -1582, z: 29.27}
		player.pos = extended.RandomPosAround(spawnLSPD, 5);
		player.dimension = 0;
	}	
}

function SpawnPlayer(player) {
	const randomPosition = extended.RandomPosAround(spawnLocation, 5);
	const randomModel = Math.floor(Math.random() * skinList.length);
	player.model = 'mp_m_freemode_01';
	player.dimension = 1;
    
	// Wait to set player health.
	setTimeout(() => {
		player.pos = randomPosition;
		player.health = 200;
	}, 1000);
    
	alt.emitClient(null, 'notifications:showWithPicture', 'Bem-vindo ao Blaine TDM', 'Por: Element & LucasMorais', 'Aperte F2 para selecionar a sua equipe e começar a jogar!', 'CHAR_BLANK_ENTRY', 1, false, -1, 13);
	
	// Setup for extended / chat
	chat.setupPlayer(player);
	extended.SetupExportsForPlayer(player);
}