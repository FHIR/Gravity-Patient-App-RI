import { atom } from "recoil";
import { Patient } from "fhir/r4";

const patientState = atom<{ [serverId: string]: Patient }>({
	key: "patientState",
	default: {}
});

export default patientState;
