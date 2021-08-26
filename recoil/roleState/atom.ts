import { atom } from "recoil";

const role = atom<string | null>({
	key: "role",
	default: null
});

export default role;
