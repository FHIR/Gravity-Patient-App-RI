import { atom } from "recoil";

const someState = atom({
	key: "someState",
	default: "Some Shared State"
});

export default someState;
