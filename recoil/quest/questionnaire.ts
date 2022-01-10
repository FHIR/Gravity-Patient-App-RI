import questState from "./atom";
import { selector } from "recoil";

const questionnaireState = selector({
	key: "questionnaireState",
	get: ({ get }) => get(questState)
});

export default questionnaireState;
