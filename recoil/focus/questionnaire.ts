import focusState from "./atom";
import { selector } from "recoil";

const focusQuestionnaireState = selector({
	key: "focusQuestionnaireState",
	get: ({ get }) => {
		const focuses = Object.values(get(focusState)).flatMap(v => v);

		return focuses.filter(r => r.resourceType === "Questionnaire");
	}
});

export default focusQuestionnaireState;
