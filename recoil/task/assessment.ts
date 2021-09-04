import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { Task } from "fhir/r4";

const taskAssessmentState = selector<Task[]>({
	key: "taskAssessmentState",
	get: ({ get }) => {
		const taskOwnedByPatient = get(ownedByPatient);

		return taskOwnedByPatient.filter(r => r.focus?.reference?.includes("Questionnaire") );
	}
});

export default taskAssessmentState;
