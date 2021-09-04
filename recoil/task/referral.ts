import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { Task } from "fhir/r4";

const taskReferralState = selector<Task[]>({
	key: "taskReferralState",
	get: ({ get }) => {
		const taskOwnedByPatient = get(ownedByPatient);

		return taskOwnedByPatient.filter(r => r.focus?.reference?.includes("ServiceRequest") );
	}
});

export default taskReferralState;
