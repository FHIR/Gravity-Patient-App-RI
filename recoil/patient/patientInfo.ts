import patient from "./atom";
import {selector} from "recoil";
import moment from "moment";
import {Patient} from "fhir/r4";

const currentPatientInfoState = selector({
	key: "currentPatientInfoState",
	get: ({get}) => {
		// TODO: Find out where to get "Employment Status, Race, Ethnicity, Education Level" fields.

		const currentPatientInfo = get(patient);
		const name: string = currentPatientInfo[0]?.name[0].given.join(" ");
		const email: string = currentPatientInfo[0]?.telecom?.find((tele: Patient["telecom"]) => tele?.system === "email").value;
		const phone: Patient["telecom"] = currentPatientInfo[0]?.telecom?.find((tele: Patient["telecom"]) => tele?.system === "phone").value;
		const id: Patient["id"] = currentPatientInfo[0]?.id;
		const patientYears: number = moment().diff(new Date(currentPatientInfo[0]?.birthDate), 'years');
		const birthDate: Patient["birthDate"] = `${moment(currentPatientInfo[0]?.birthDate,'YYYY-MM-DD').format('MMM DD, YYYY')} (${patientYears} yrs)`;
		const gender: Patient["gender"] = currentPatientInfo[0]?.gender;
		const address: string = currentPatientInfo[0]?.address[0].line + ", "+ currentPatientInfo[0]?.address[0].city + ", " + currentPatientInfo[0]?.address[0].state + ", " + currentPatientInfo[0]?.address[0].postalCode;
		const language: Patient["communication"] = currentPatientInfo[0]?.communication ? currentPatientInfo[0]?.communication[0].language.coding[0].display : "N/A";
		const maritalStatus: Patient["maritalStatus"] =  currentPatientInfo[0]?.maritalStatus ? currentPatientInfo[0]?.maritalStatus.coding[0].display : "N/A";

		return {
			name,
			email,
			phone,
			id,
			birthDate,
			gender,
			address,
			language,
			maritalStatus
		};
	},
});

export default currentPatientInfoState;
