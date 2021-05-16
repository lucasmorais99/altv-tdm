import * as alt from 'alt';
import * as color from './colors.mjs';
import * as chat from 'chat';

console.log(`${color.FgYellow}Alt:V - TDM Event Helper has been loaded!`);


// Random position around a point
export function randomPosAround(pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error(`{FF0000}[randomPosAround]Erro: posi��o ou range indefinidos.`);
	}

	return {
		x: pos.x + (Math.random() * (range * 2)) - range,
		y: pos.y + (Math.random() * (range * 2)) - range,
		z: pos.z
	};
}

export function isPlayerNearPos(player, pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error('{FF0000}[isNearPos] pos ou range indefinidos.');
	}

	var currentDistance = Distance(player.pos, pos);
	if (currentDistance <= range)
		return true;
	return false;
};

export function showPlayerNotification(player, imageName, headerMsg, detailsMsg, message) {
	if (imageName === undefined || headerMsg === undefined || detailsMsg === undefined || message === undefined) {
		throw new Error('{FF000}[showPlayerNotification]Um ou mais par�metros est�o errados.');
	}

	alt.emitClient(player, 'showNotification', imageName, headerMsg, detailsMsg, message);
};