import * as alt from 'alt';
import * as chat from 'chat';
import * as color from './colors.mjs';
import * as eventHelper from './eventHelper.mjs'
import { skinList } from './skins.mjs';
import { skinBallas } from './skins.mjs';
import { skinVagos } from './skins.mjs';
import { skinLSPD } from './skins.mjs';
import { weaponList } from './weapons.mjs';

console.log(`${color.FgYellow}Alt:V - TDM Event Handler has been loaded!`);

const spawnBallas = { x: 176.43, y: -1736.61, z: 29.27 };
const spawnVagos = { x: 61.33, y: -1567, z: 29.44 };
const spawnLSPD = { x: 359.14, y: -1582, z: 29.27 };
const spawnLocation = { x: 104.75, y: -1943.61, z: 20.78 };

// Create player stats
var playerVehicle;

var playerKills = 0;

var playerHasVehicle = false;
var playerTeam;

// Player Connect Handler
export function playerJoin(player) {
	alt.emit('broadcastMessage', `{FFF000}${player.name}{FFFFFF} entrou no servidor.`);
	utility.loadModelForPlayers(player);

	SpawnPlayer(player);
}

// Player Spawn Handler
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

	eventHelper.showPlayerNotification(player, 'CHAR_BLANK_ENTRY', 'Bem-vindo ao Blaine TDM', 'Por: Element & Mago1337', 'Caso deseje trocar de equipe, aperte F2!');

	// Setup for extended / chat
	chat.setupPlayer(player);
}

// Player Disconnect Handler
export function playerDisconnect(player) {
	// Remove from dimension if they're in one.
	if (player.currentDimension)
		player.currentDimension.Remove(player);

	// Destroy player vehicle
	if (playerHasVehicle == true) {
		try {
			playerVehicle.destroy();
			playerHasVehicle = false;
		} catch (err) { alt.log(`Erro (disconnect): ${err}`) }
	}
}

// Player Death Handler
export function onPlayerDeath(victim, killer, weapon) {

	alt.emitClient(victim, 'notifications:show', 'Você morreu e retornará ao spawn de sua facção.', false, 6);
	alt.emitClient(null, 'notifications:showWithPicture', `${killer} te matou`, `Arma: ${weaponList[weapon]}`, 'A vingança nunca é plena, mata a alma e evenena!', 'CHAR_CALL911', 1, false, -1, 3);
	console.log(JSON.stringify(victim));
	console.log(JSON.stringify(killer));
	if (victim != killer) {
		addPlayerPoint(killer);
	}
}

// Player Respawn Handler
export function respawnPlayer(target) {

	const skin = target.model;

	target.dimension = 0;

	setTimeout(() => {
		if (playerTeam = 'Ballas') {
			target.spawn(spawnBallas.x, spawnBallas.y, spawnBallas.z);
		}
		else if (playerTeam = 'Vagos') {
			target.spawn(spawnVagos.x, spawnVagos.y, spawnVagos.z);
		}
		else if (playerTeam = 'LSPD') {
			target.spawn(spawnLSPD.x, spawnLSPD.y, spawnLSPD.z);
			target.armor = 200;
		}
		target.health = 200;
	}, 4000);
}


// Player Team Handler
export function setPlayerTeam(player, sel) {
	playerTeam = sel;

	if (sel == 'Ballas') {
		const randomBallas = Math.floor(Math.random() * skinBallas.length);
		player.model = alt.hash(skinBallas[randomBallas]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistol'], 48, false);
		player.pos = extended.RandomPosAround(spawnBallas, 5);
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'faction');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Faction{FFFFFF} por ter se juntado à ${sel}.`);
		}, 1000);
	}
	else if (sel == 'Vagos') {
		const randomVagos = Math.floor(Math.random() * skinVagos.length);
		player.model = alt.hash(skinVagos[randomVagos]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistol'], 48, false);
		player.pos = extended.RandomPosAround(spawnVagos, 5);
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'tornado');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Tornado{FFFFFF} por ter se juntado à ${sel}.`);
		}, 1000);
	}

	else if (sel == 'LSPD') {
		const randomLSPD = Math.floor(Math.random() * skinLSPD.length);
		player.model = alt.hash(skinLSPD[randomLSPD]);
		utility.loadModelForPlayers(player);
		player.giveWeapon(weaponList['pistolmk2'], 48, false);
		player.giveWeapon(weaponList['pumpshotgun'], 48, false);
		player.pos = extended.RandomPosAround(spawnLSPD, 5);
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'police3');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Police Cruiser{FFFFFF} por ter se juntado à ${sel}.`);
		}, 1000);
	}
}

// Player Vehicle Spawn Handler: spawns vehicle and sets player inside it
export function spawnPlayerVehicle(player, arg) {

	if (!arg[0])
		return chat.send(player, '{FF0000}Algo deu errado no spawn do veículo.');

	if (player.personalVehicle !== undefined) {
		try {
			player.personalVehicle.destroy();
		} catch (err) {
			player.personalVehicle = undefined;
		}
	}

	const positionNear = extended.RandomPosAround(player.pos, 10);

	try {
		player.personalVehicle = new alt.Vehicle(arg[0], positionNear.x, positionNear.y, positionNear.z, 0, 0, 0);
		player.personalVehicle.dimension = player.dimension;
		alt.emitClient(player, 'warpIntoVehicle', player.personalVehicle);
		chat.send(player, `Você spawnou um {FFF000}${arg}{FFFFFF}.`);
		player.personalVehicle.customPrimaryColor = extended.GetRandomColor();
		player.personalVehicle.customSecondaryColor = extended.GetRandomColor();
	} catch (err) {
		player.personalVehicle = undefined;
		chat.send(player, '{FF0000}Veículo inválido, tente novamente.');
	}
}