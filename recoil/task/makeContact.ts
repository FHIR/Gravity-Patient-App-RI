import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { Task } from "fhir/r4";

const taskMakeContactState = selector<Task[]>({
	key: "taskMakeContactState",
	get: ({ get }) => get(ownedByPatient).filter(r => r.input?.some(item => item.type?.coding?.[0]?.code === "contact-entity"))
});

export default taskMakeContactState;
