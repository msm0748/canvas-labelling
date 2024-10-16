import type { Polygon } from '../polygon/Polygon';

export const removeDuplicates = (arr: Polygon[]) => {
	// Create a map to track the unique objects based on their 'id' property
	const uniqueObjectsMap = new Map();

	arr.forEach((obj) => {
		uniqueObjectsMap.set(obj.id, obj);
	});

	// Convert the map's values back into an array
	const uniqueArray = Array.from(uniqueObjectsMap.values());

	return uniqueArray;
};
