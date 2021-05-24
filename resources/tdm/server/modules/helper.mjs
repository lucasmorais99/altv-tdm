import * as alt from 'alt';

export function randomNumber(min, max) {  
    return Math.round(Math.random() * (max - min) + min); 
}

export function getRandomListEntry(list){
    return randomNumber(0, list.length - 1);
}

export function randomPosAround(pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error('RandomPosAround => pos or range is undefined');
	}

	return {
		x: pos.x + (Math.random() * (range * 2)) - range,
		y: pos.y + (Math.random() * (range * 2)) - range,
		z: pos.z
	};
}

export function SendNotificationToPlayer(player, message, textColor=0, bgColor=2, blink=false){
    alt.emitClient(player, "freeroam:sendNotification", textColor, bgColor, message, blink);
}

export function SendNotificationToAllPlayer(message, textColor=0, bgColor=2, blink=false){
    alt.Player.all.forEach(plr => SendNotificationToPlayer(plr, message, textColor, bgColor, blink));
}

export function loadModelForPlayers(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(target, 'updateModel', player.model);
	});
}

export function loadModelsForPlayer(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(player, 'updateModel', target.model);
	});
}

export function suicidePlayer(player) {
	alt.Player.all.forEach((target) => {
		alt.emitClient(target, 'suicidePlayer', player);
	});
}