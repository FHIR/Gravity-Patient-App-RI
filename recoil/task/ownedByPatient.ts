import taskState from "./atom";
import patientState from "../patient";
import { selector } from "recoil";

const taskOwnedByPatientState = selector({
	key: "taskOwnedByPatientState",
	get: ({ get }) => {
		const tasks = Object.values(get(taskState)).flatMap(v => v);
		const primaryPatient = Object.values(get(patientState))[0];

		return tasks.filter(r => r.owner?.reference === `${primaryPatient.resourceType}/${primaryPatient.id}`);
	}
});

export default taskOwnedByPatientState;
