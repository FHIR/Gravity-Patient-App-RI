import patientState from "./atom";
import { selector } from "recoil";
import moment from "moment";

type PatientInfo = {
	name: string | undefined,
	email: string | undefined,
	phone: string | undefined,
	id: string | undefined,
	birthDate: string | undefined,
	gender: string | undefined,
	address: string | undefined,
	language: string | undefined,
	maritalStatus: string | undefined,
	race: string | undefined,
	ethnicity: string | undefined,
	educationLevel: string | undefined,
	employmentStatus: string | undefined,
	photo: string | undefined
};
const EXTENSION = {
	RACE: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
	ETHNICITY: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
	EDUCATION_LEVEL: "http://terminology.hl7.org/CodeSystem/v3-EducationLevel",
	EMPLOYMENT_STATUS: "http://hl7.org/fhir/us/odh/StructureDefinition/odh-EmploymentStatus"
};

const patientInfoState = selector<PatientInfo>({
	key: "patientInfoState",
	get: ({ get }) => {
		const patientInfoState = Object.values(get(patientState))[0];
		const name = patientInfoState?.name?.[0].given?.join(" ");
		const email = patientInfoState?.telecom?.find(tele => tele?.system === "email")?.value;
		const phone = patientInfoState?.telecom?.find(tele => tele?.system === "phone")?.value;
		const id = patientInfoState?.id;
		const patientYears = patientInfoState?.birthDate ? moment().diff(new Date(patientInfoState.birthDate), "years") : undefined;
		const birthDate = patientInfoState?.birthDate ? `${moment(patientInfoState.birthDate,"YYYY-MM-DD").format("MMM DD, YYYY")} (${patientYears} yrs)` : undefined;
		const gender = patientInfoState?.gender;
		const address = patientInfoState?.address ? `${patientInfoState.address[0].line} , ${patientInfoState.address[0].city}, ${patientInfoState.address[0].state}, ${patientInfoState.address[0].postalCode}` : undefined;
		const language = patientInfoState?.communication?.[0].language?.coding?.[0].display;
		const maritalStatus =  patientInfoState?.maritalStatus?.coding?.[0].display;
		const race = patientInfoState?.extension?.find(extension => extension?.url === EXTENSION.RACE)?.extension?.[0].valueCoding?.display;
		const ethnicity = patientInfoState?.extension?.find(extension => extension?.url === EXTENSION.ETHNICITY)?.extension?.[0].valueCoding?.display;
		const educationLevel = patientInfoState?.extension?.find(extension => extension?.url === EXTENSION.EDUCATION_LEVEL)?.extension?.[0].valueCoding?.display;
		const employmentStatus = patientInfoState?.extension?.find(extension => extension?.url === EXTENSION.EMPLOYMENT_STATUS)?.extension?.[0].valueCoding?.display;
		const photo = patientInfoState?.photo?.[0] ? `data:${patientInfoState.photo[0].contentType};base64,${patientInfoState.photo[0].data}` : undefined;

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
			employmentStatus,
			photo
		};
	}
});

export default patientInfoState;
