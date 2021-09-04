import { atom } from "recoil";
import { Owner } from "../../utils/api";

const ownerState = atom<{ [serverId: string]: Owner[] }>({
	key: "ownerState",
	default: {}
});

export default ownerState;
