import { atom } from "recoil";
import { Payor } from "../../utils/api";

const payor = atom<Payor[]>({
	key: "payorState",
	default: []
});

export default payor;
