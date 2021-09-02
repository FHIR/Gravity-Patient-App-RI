import { atom } from "recoil";
import { Task } from "fhir/r4";

const task = atom<Task[]>({
	key: "taskState",
	default: []
});

export default task;
