import { selector } from "recoil";
import atom from "./atom";

const someStateWithBrackets = selector({
	key: "someStateWithBrackets",
	get: ({ get }) => {
		const state = get(atom);

		return `[${state}]`;
	}
});

export default someStateWithBrackets;
