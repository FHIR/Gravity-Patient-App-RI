import { atom } from "recoil";
import { Location } from "fhir/r4";

const locationsState = atom<{ [serverId: string]: Location[] }>({
	key: "locationsState",
	default: {},
});

export default locationsState;
