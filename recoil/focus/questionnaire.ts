import focusState from "./atom";
import { selector } from "recoil";
import { mapHash } from "../../utils";
import { Questionnaire } from "fhir/r4";

const focusQuestionnaireState = selector({
	key: "focusQuestionnaireState",
	get: ({ get }) => {
		return mapHash(get(focusState), focus => focus.filter(r => r.resourceType === "Questionnaire") as Questionnaire[]);
	}
});

export default focusQuestionnaireState;
