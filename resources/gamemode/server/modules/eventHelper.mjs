import * as alt from 'alt';
import * as color from './colors.mjs';

console.log(`${color.FgYellow}Alt:V - TDM Event Helper has been loaded!`);


// Random position around a point
export function randomPosAround(pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error(`{FF0000}Erro: posição ou range indefinidos.`);
	}

	return {
		x: pos.x + (Math.random() * (range * 2)) - range,
		y: pos.y + (Math.random() * (range * 2)) - range,
		z: pos.z
	};
}

// Near position check (bool)
export function isPlayerNearPos(player, pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error('isNearPos => pos or range is undefined');
	}

	var currentDistance = Distance(player.pos, pos);
	if (currentDistance <= range)
		return true;
	return false;
};

// Player notifications
export function showPlayerNotification(player, imageName, headerMsg, detailsMsg, message) {
	if (imageName === undefined || headerMsg === undefined || detailsMsg === undefined || message === undefined) {
		throw new Error('{FF000}[showPlayerNotification]Um ou mais parâmetros estão errados.');
	}

	alt.emitClient(player, 'showNotification', imageName, headerMsg, detailsMsg, message);
};

// Model syncing
export function loadModelForPlayers(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(target, 'updateModel', player.model);
	});
}

// Model syncing II
export function loadModelsForPlayer(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(player, 'updateModel', target.model);
	});
}


// Suicide h
export function suicidePlayer(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(target, 'suicidePlayer', player);
	});
}