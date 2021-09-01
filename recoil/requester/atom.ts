import { atom } from "recoil";
import { Requester } from "../../utils/api";

const requester = atom<Requester[]>({
	key: "requesterState",
	default: []
});

export default requester;
