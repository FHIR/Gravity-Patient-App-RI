import taskState from "./atom";
import patientState from "../patient";
import { selector } from "recoil";
import { Task } from "fhir/r4";

const taskOwnedByPatientState = selector<Task[]>({
	key: "taskOwnedByPatientState",
	get: ({ get }) => {
		const tasks = Object.entries(get(taskState)).flatMap(v => v[1].map(t => ({ ...t, serverId: v[0] })));
		const patients = Object.values(get(patientState));

		return tasks.filter(r => {
			const patientId = r.owner?.reference?.split("/")[1];

			return r.owner?.reference === `Patient/${patients.find(p => p.id === patientId)?.id}`;
		});
	}
});

export default taskOwnedByPatientState;
