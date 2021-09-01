import patient from "./atom";
import { selector } from "recoil";
import moment from "moment";
import { Patient } from "fhir/r4";

const patientState = selector({
	key: "patientState",
	get: ({ get }) => {
		// TODO: Find out where to get "Employment Status, Race, Ethnicity, Education Level" fields.

		const patientInfoState: Patient | undefined = get(patient)[0];
		const name: string | undefined = patientInfoState?.name[0].given.join(" ");
		const email: string | undefined = patientInfoState?.telecom?.find((tele: Patient["telecom"]) => tele?.system === "email").value;
		const phone: string | undefined = patientInfoState?.telecom?.find((tele: Patient["telecom"]) => tele?.system === "phone").value;
		const id: string | undefined = patientInfoState?.id;
		const patientYears: number = moment().diff(new Date(patientInfoState?.birthDate), "years");
		const birthDate: string = `${moment(patientInfoState?.birthDate,"YYYY-MM-DD").format("MMM DD, YYYY")} (${patientYears} yrs)`;
		const gender: string | undefined = patientInfoState?.gender;
		const address: string | undefined = `${patientInfoState?.address[0].line} , ${patientInfoState?.address[0].city}, ${patientInfoState?.address[0].state}, ${patientInfoState?.address[0].postalCode}`;
		const language: string | undefined = patientInfoState?.communication ? patientInfoState?.communication[0].language.coding[0].display : "N/A";
		const maritalStatus: string | undefined =  patientInfoState?.maritalStatus ? patientInfoState?.maritalStatus.coding[0].display : "N/A";
		const race : string | undefined = patientInfoState?.extension ? patientInfoState?.extension.find(extension => extension?.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race").valueCode : "N/A";
		const ethnicity : string | undefined = patientInfoState?.extension ? patientInfoState?.extension.find(extension => extension?.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity").valueCode : "N/A";
		const educationLevel : string | undefined = patientInfoState?.extension ? patientInfoState?.extension.find(extension => extension?.url === "http://terminology.hl7.org/CodeSystem/v3-EducationLevel").valueCode : "N/A";
		const employmentStatus : string | undefined = patientInfoState?.extension ? patientInfoState?.extension.find(extension => extension?.url === "http://hl7.org/fhir/us/odh/StructureDefinition/odh-EmploymentStatus").valueCode : "N/A";

		return {
			name,
			email,
			phone,
			id,
			birthDate,
			gender,
			address,
			language,
			maritalStatus,
			race,
			ethnicity,
			educationLevel,
			employmentStatus
		};
	}
});

export default patientState;
