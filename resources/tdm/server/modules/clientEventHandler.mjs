import * as alt from 'alt';
import * as chat from 'chat';
import * as helper from './helper.mjs';
import { weapons } from './lists.mjs';
import { skinBallas } from './lists.mjs'
import { skinVagos } from './lists.mjs'
import { skinLSPD } from './lists.mjs'

var playerTeam;

// Player Team Handler
function setPlayerTeam(player, sel) {

	playerTeam = sel;

	if (sel == 'Ballas') {
		const randomBallas = Math.floor(Math.random() * skinBallas.length);
		player.model = alt.hash(skinBallas[randomBallas]);
		helper.loadModelForPlayers(player);
		player.giveWeapon(alt.hash('weapon_pistol'), 48, false);
		player.giveWeapon(alt.hash('weapon_machinepistol'), 90, false);
		player.spawn(176.43, -1736.61, 31, 0);
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'faction');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Faction{FFFFFF} por ter se juntado à ${sel}.`);
			alt.emitClient(player, "freeroam:switchInOutPlayer", true);
		}, 1000);
	}

	else if (sel == 'Vagos') {
		const randomVagos = Math.floor(Math.random() * skinVagos.length);
		player.model = alt.hash(skinVagos[randomVagos]);
		helper.loadModelForPlayers(player);
		player.giveWeapon(alt.hash('weapon_pistol'), 48, false);
		player.giveWeapon(alt.hash('weapon_machinepistol'), 90, false);
		player.spawn(61.33, -1567, 29.44, 0)
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'tornado');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Tornado{FFFFFF} por ter se juntado à ${sel}.`);
			alt.emitClient(player, "freeroam:switchInOutPlayer", true);
		}, 1000);
	}

	else if (sel == 'LSPD') {
		const randomLSPD = Math.floor(Math.random() * skinLSPD.length);
		player.model = alt.hash(skinLSPD[randomLSPD]);
		helper.loadModelForPlayers(player);
		player.giveWeapon(alt.hash('weapon_pistol_mk2'), 48, false);
		player.giveWeapon(alt.hash('weapon_specialcarbine_mk2'), 90, false);
		player.spawn(380.67, -1580.83, 29.27, 0)
		player.dimension = 0;
		setTimeout(() => {
			spawnPlayerVehicle(player, 'police3');
			chat.send(player, `Você recebeu um veículo modelo {FFF000}Police Cruiser{FFFFFF} por ter se juntado à ${sel}.`);
			alt.emitClient(player, "freeroam:switchInOutPlayer", true);
		}, 1000);
	}
}

export { playerTeam };

// On nativeUI selection
alt.onClient('setPlayerTeam', setPlayerTeam);

// Vehicle spawn handler
function spawnPlayerVehicle(player, veh) {
	try {
		var vehicle = new alt.Vehicle(veh, player.pos.x+1, player.pos.y+1, player.pos.z, 0, 0, 0);
	} catch {
		chat.send(player, `{ff0000} Este veículo {ff9500}${veh} {ff0000}não existe.`);
	} finally {
		var pvehs = player.getMeta("vehicles");
		if (pvehs.length >= 1) {
			var toDestroy = pvehs.pop();
			if (toDestroy != null) {
				toDestroy.destroy();
			}
		}
		pvehs.unshift(vehicle);
		player.setMeta("vehicles", pvehs);
	}
}

// Player ammo refill
alt.onClient('playerEnterMarker', (player, id) => {
	alt.emitClient(player, 'playerEnterMarker');
})

alt.onClient('playerInteractWithMarker', (player, id) => {
	if (playerTeam == 'Ballas') {
		player.giveWeapon(alt.hash('weapon_pistol'), 48, false);
		player.giveWeapon(alt.hash('weapon_machinepistol'), 90, false);
	}

	else if (playerTeam == 'Vagos') {
		player.giveWeapon(alt.hash('weapon_pistol'), 48, false);
		player.giveWeapon(alt.hash('weapon_machinepistol'), 90, false);
	}

	else if (playerTeam == 'LSPD') {
		player.giveWeapon(alt.hash('weapon_pistol_mk2'), 48, false);
		player.giveWeapon(alt.hash('weapon_specialcarbine_mk2'), 90, false);
	}
});