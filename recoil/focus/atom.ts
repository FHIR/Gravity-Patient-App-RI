import { atom } from "recoil";
import { Focus } from "../../utils/api";

const focusState = atom<{ [serverId: string]: Focus[] }>({
	key: "focusState",
	default: {}
});

export default focusState;
