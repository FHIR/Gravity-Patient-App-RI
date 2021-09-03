import { atom } from "recoil";
import { Owner } from "../../utils/api";

const owner = atom<Owner[]>({
	key: "ownerState",
	default: []
});

export default owner;
