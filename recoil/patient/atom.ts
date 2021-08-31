import { atom } from "recoil";
import { Patient } from "fhir/r4";

const patient = atom<Patient[]>({
	key: "patient",
	default: []
});

export default patient;
