import * as extended from 'server-extended'; // https://github.com/team-stuyk-alt-v/altV-Extended
import * as alt from 'alt';
import { weaponList } from './weapons.mjs';
import { Dimension, CurrentDimensions } from './dimension.mjs';
import * as utility from './utility.mjs';
import * as chat from 'chat';
import * as notifications from 'notifications';
import * as timer from 'timer';

/**
 * Teste de timer?
 */
export function setTimer(player, arg) {
	var timer = arg[0];
    
	if (timer < 30)
		return chat.send(player, '{FF0000}O tempo mínimo para o timer é de trinta segundos!');
	
	alt.emitClient(null, 'notifications:show', `Você criou um timer de ${timer} segundos!`, false, 134);
	
	var contador = setInterval(count, 1000); 

	function count() {
		if (timer > 0) {
			timer = timer - 1;

			alt.emitClient(null, "timerbars:removeAll");

			if (timer < 30) {
				alt.emitClient(null, "timerbars:create", "timer", "text", "", { text: `${timer} segundos` });
				alt.emitClient(null, "timerbars:setTextColor", "timer", 6);
			}
			else {
				alt.emitClient(null, "timerbars:create", "timer", "text", "", { text: `${timer} segundos` });
            }
		}
		else {
			alt.emitClient(null, 'notifications:show', `O timer terminou!`, false, 134);
			alt.emitClient(null, "timerbars:removeAll");
			clearInterval(contador);
		}
	}
}

/**
 * Give a weapon to yourself.
 * @param player 
 * @param arg
 */
export function giveWeapon(player, arg) {
	const weaponName = arg[0].toLowerCase();
    
	if (!weaponList[weaponName])
		return chat.send(player, '{FF0000}Arma inválida.');
	
	alt.emitClient(null, 'notifications:showWithPicture', 'Você recebeu uma arma!', 'Ammunation', `Arma recebida: ${weaponName}`, 'CHAR_AMMUNATION', 1, false, -1, 6);
	player.giveWeapon(weaponList[weaponName], 48, true);
}

/**
 * Clear the weapons the player currently has.
 * @param player
 */
export function clearWeapons(player) {
	chat.send(player, 'Suas armas foram removidas.');
	player.removeAllWeapons();
}

/**
 * Spawn a vehicle and set the player into the vehicle.
 * @param player
 * @param arg
 */
export function spawnVehicle(player, arg) {
	
	if (!arg[0])
		return chat.send(player, '{FF0000}Veículo inválido, tente novamente.');

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
	} catch(err) {
		player.personalVehicle = undefined;
		chat.send(player, '{FF0000}Veículo inválido, tente novamente.');
	}
}

/**
 * Set the customPrimary Color for a vehicle.
 * @param player
 * @param arg [r, g, b]
 */
export function setVehicleColor1(player, arg) {
	if (!player.vehicle)
		return chat.send(player, '{FF0000}You are not in a vehicle.');

	if (arg.length !== 3)
		return chat.send(player, '{FF0000}/vehcolor1 [r] [g] [b]');
	
	chat.send(player, `Você setou as cores do seu veículo para ${arg[0]} ${arg[1]} ${arg[2]}`);
	player.vehicle.customPrimaryColor = { r: arg[0], g: arg[1], b: arg[2] };
}

/**
 * Set the customPrimary Color for a vehicle.
 * @param player
 * @param arg [r, g, b]
 */
export function setVehicleColor2(player, arg) {
	if (!player.vehicle)
		return chat.send(player, '{FF0000}You are not in a vehicle.');

	if (arg.length !== 3)
		return chat.send(player, '{FF0000}/vehcolor1 [r] [g] [b]');

	player.vehicle.customSecondaryColor = { r: arg[0], g: arg[1], b: arg[2] };
}

/**
 * Return the position of the player to the player's chatbox.
 * @param player
 */
export function getPos(player) {
	chat.send(player, `${JSON.stringify(player.pos)}`);
}

/**
 * Set the skin for the player. Takes a string parameter.
 * @param player
 * @param arg
 */
export function setSkin(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}Skin type is not valid.');

	try {
		player.model = arg[0];
		utility.loadModelForPlayers(player);
		chat.send(player, 'You have changed your skin.');
	} catch(err) {
		chat.send(player, 'Incorrect model name.');
	}
}

/**
 * Teleport to a player by name.
 * @param player
 * @param arg [playerName]
 */
export function teleportToPlayer(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}/tpto [playername]');

	const target = alt.getPlayersByName(arg[0]);

	if (!target || !target[0])
		return chat.send(player, '{FF0000}Player does not exist.');

	if (Array.isArray(target) && target.length >= 2)
		return chat.send(player, '{FF0000}Too many players found; be more specific.');

	if (target[0].dimension !== player.dimension)
		return chat.send(player, '{FF0000}You are not in the same dimension.');

	player.pos = target[0].pos;
}

/**
 * Teleport to coordinates
 * @param player
 * @param arg [x, y, z]
 */
export function teleportToCoordinates(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}/tp [x] [y] [z]');

	if (arg.length !== 3)
		return chat.send(player, '{FF0000}/tp [x] [y] [z]');

	player.pos = { x: arg[0], y: arg[1], z: arg[2] };
}

/**
 * Kill the player. Shoots himself.
 * @param player
 */
export function killSelf(player) {
	utility.suicidePlayer(player);
}

/**
 * Set a player's dimension and make it private.
 * @param player
 * @param arg [dimensionID]
 */
export function setDimension(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}/dimension [number]');

	// Get players current dimension.
	// Check if they are the leader; kick all players from dimension if they are.
	// Otherwise just leave the dimension.
	if (player.currentDimension !== undefined) {
		// Kick all players from dimension if owner.
		if (player.currentDimension.leader === player) {
			player.currentDimension.KickAll();
		} else {
			// Remove from current dimension.
			player.currentDimension.Remove(player);
			player.dimension = 0;
			player.currentDimension = undefined;
		}
	}

	// If current dimension is 0.
	if (parseInt(arg[0]) === 0)
		return;

	let playersInCurrentDimension = alt.Player.all.find(x => x.dimension === parseInt(arg[0]));

	if (playersInCurrentDimension !== undefined)
		return chat.send(player, '{FF0000} That dimension is currently in use.');

	// Create a new dimension and set the player as the party leader.
	// Also set the player into that dimension.
	let dimension = new Dimension(player, arg[0]);
	CurrentDimensions.set(`${arg[0]}`, dimension);
	player.currentDimension = dimension; 
	player.dimension = arg[0];
	chat.send(player, `You have joined dimension: ${arg[0]}`);
}

/**
 * Invite a player to a dimension.
 * @param player
 * @param arg
 */
export function inviteDimension(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}/invite [playername]');

	if (arg[0].length <= 2)
		return chat.send(player, '{FF0000}Please specify at least 3 characters for a username.');

	if (player.dimension <= 0)
		return chat.send(player, '{FF0000}Cannot invite to dimension 0.');

	if (!player.currentDimension) {
		chat.send(player, '{FF0000}/dimension [number]');
		return;
	}

	if (player.currentDimension.leader !== player)
		return chat.send(player, '{FF0000}You are not the dimension leader.');

	const players = alt.getPlayersByName(arg[0]);

	if (!players)
		return chat.send(player, '{FF0000}No users were found.');

	for (let i = 0; i < players.length; i++) {
		if (players[i] === player)
			continue;

		players[i].lastInvite = `${player.dimension}`;
		players[i].sendMessage(`{00FF00}You recieved an invite for dimension ${player.dimension} from ${player.name}`);
		players[i].sendMessage('Type {FFF000}/joindim {FFFFFF}to join the dimension.');
	}
}

/**
 * Join a dimension by invite.
 * @param player
 */
export function joinDimension(player) {
	if (!player.lastInvite)
		return chat.send(player, '{FF0000}No dimension is available to join.');
        

	const currentDimension = CurrentDimensions.get(player.lastInvite);

	if (!currentDimension) {
		player.lastInvite = undefined;
		return chat.send(player, '{FF0000}The dimension invite has expired.');
	}

	currentDimension.Join(player);
}

/**
 * Kick a player from your dimension.
 * Requires dimension leader.
 * @param player
 * @param arg
 */
export function kickFromDimension(player, arg) {
	if (!arg[0])
		return chat.send(player, '{FF0000}/invite [playername]');

	if (!player.currentDimension) 
		return chat.send(player, '{FF0000}/dimension [number]');

	if (player.currentDimension.leader !== player)
		return chat.send(player, '{FF0000}You are not the dimension leader.');

	player.currentDimension.Kick(arg[0]);
}

export function myDimension(player) {
	chat.send(player, `Sua dimensão é ${player.dimension}`);
}
