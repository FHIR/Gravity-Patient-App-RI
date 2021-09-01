import { atom } from "recoil";
import { Patient } from "fhir/r4";

const patient = atom<Patient[]>({
	key: "patientState",
	default: []
});

export default patient;
