import { atom } from "recoil";

const roleState = atom<string | null>({
	key: "roleState",
	default: null
});

export default roleState;
