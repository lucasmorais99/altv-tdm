import * as alt from 'alt';
import * as color from './colors.mjs';
import * as chat from 'chat';

console.log(`${color.FgYellow}Alt:V - TDM Event Helper has been loaded!`);

export function RandomPosAround(pos, range) {
	if (pos === undefined || range === undefined) {
		throw new Error('RandomPosAround => pos or range is undefined');
	}

	return {
		x: pos.x + (Math.random() * (range * 2)) - range,
		y: pos.y + (Math.random() * (range * 2)) - range,
		z: pos.z
	};
}