import * as alt from 'alt';
import * as chat from 'chat';
import * as color from './colors.mjs';
import { skinList } from './skins.mjs';
import { skinBallas } from './skins.mjs';
import { skinVagos } from './skins.mjs';
import { skinLSPD } from './skins.mjs';
import { weaponList } from './weapons.mjs';

console.log(`${color.FgYellow}Alt:V - TDM Event Handler has been loaded!`);

const spawnBallas = { x: 176.43, y: -1736.61, z: 29.27 };
const spawnVagos = { x: 61.33, y: -1567, z: 29.44 };
const spawnLSPD = { x: 359.14, y: -1582, z: 29.27 };


// Vehicle Spawn Handler: spawns vehicle and sets player inside it

export function spawnVehicle(player, arg) {

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