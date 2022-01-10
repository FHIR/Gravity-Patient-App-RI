import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { Task } from "fhir/r4";

const taskReferralState = selector<Task[]>({
	key: "taskReferralState",
	get: ({ get }) => get(ownedByPatient).filter(r => r.input?.some(item => item.type?.coding?.[0]?.code === "questionnaire-category" && item.valueCodeableConcept?.coding?.[0].code === "feedback-questionnaire"))
});

export default taskReferralState;
