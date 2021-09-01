import { atom } from "recoil";
import { Coverage } from "fhir/r4";

const coverage = atom<Coverage[]>({
	key: "coverageState",
	default: []
});

export default coverage;
