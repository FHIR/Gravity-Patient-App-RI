import taskState from "./atom";
import patientState from "../patient";
import { selector } from "recoil";
import { Task } from "fhir/r4";

const taskOwnedByPatientState = selector<Task[]>({
	key: "taskOwnedByPatientState",
	get: ({ get }) => {
		const tasks = Object.entries(get(taskState)).flatMap(v => v[1].map(t => ({ ...t, serverId: v[0] })));
		const [primaryPatient] = Object.values(get(patientState));

		return tasks.filter(r => r.owner?.reference === `${primaryPatient.resourceType}/${primaryPatient.id}`);
	}
});

export default taskOwnedByPatientState;
