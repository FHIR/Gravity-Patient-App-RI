import { atom } from "recoil";
import { Task } from "fhir/r4";

const taskState = atom<{ [serverId: string]: Task[] }>({
	key: "taskState",
	default: {}
});

export default taskState;
