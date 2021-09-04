import { atom } from "recoil";
import { Payor } from "../../utils/api";

const payorState = atom<{ [serverId: string]: Payor[] }>({
	key: "payorState",
	default: {}
});

export default payorState;
