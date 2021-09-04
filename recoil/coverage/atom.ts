import { atom } from "recoil";
import { Coverage } from "fhir/r4";

const coverageState = atom<{ [serverId: string]: Coverage[] }>({
	key: "coverageState",
	default: {}
});

export default coverageState;
