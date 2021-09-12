import Client from "fhir-kit-client";
import {
	Patient,
	Coverage,
	Organization,
	RelatedPerson,
	Task,
	Device,
	Practitioner,
	PractitionerRole,
	Bundle,
	CareTeam,
	HealthcareService,
	ServiceRequest,
	Questionnaire,
	QuestionnaireResponse
} from "fhir/r4";
import { filterMap } from ".";

export type Payor = (Organization | Patient | RelatedPerson);
export type Owner = (Practitioner | PractitionerRole | Organization | CareTeam | HealthcareService | Patient | Device | RelatedPerson);
export type Focus = (ServiceRequest | Questionnaire)
export type fetchFhirType = {
	patient: Patient | null,
	coverage: Coverage[] | null,
	task: Task[] | null,
	payor: Payor[] | null,
	owner: Owner[] | null,
	focus: Focus[] | null,
	questResp: QuestionnaireResponse[]
};

export const fetchFhirData = async (serverURI: string, token: string | null, patientId: string): Promise<fetchFhirType> => {
	const client = new Client({ baseUrl: serverURI });
	if (token) {
		client.bearerToken = token;
	}

	const patient = await client.read({ resourceType: "Patient", id: patientId });
	const coverageBundle = await client.search({ resourceType: "Coverage", searchParams: { patient: patientId, _include: "Coverage:payor" } }) as Bundle;
	const [coverage, payor] = splitInclude<Coverage[], Payor[]>(coverageBundle);
	let taskBundle = await client.search({ resourceType: "Task", searchParams: { patient: patientId, _include: "Task:owner" } }) as Bundle;
	const [task, owner] = splitInclude<Task[], Owner[]>(taskBundle);
	taskBundle = await client.search({ resourceType: "Task", searchParams: { patient: patientId, _include: "Task:focus" } }) as Bundle;
	const [_, focus] = splitInclude<Task[], Focus[]>(taskBundle);
	const questRespBundle = await client.search({ resourceType: "QuestionnaireResponse" }) as Bundle;
	const questResp = filterMap(questRespBundle.entry || [], entry => entry.resource ? entry.resource as QuestionnaireResponse : false);

	return {
		patient: patient.resourceType === "Patient" ? patient as Patient : null,
		coverage,
		payor,
		task,
		owner,
		focus,
		questResp
	};
};

//todo: fix return types
export const splitInclude = <T, K>(bundle: Bundle): [T | null, K | null] => {
	if (!bundle.entry) {
		return [null, null];
	}

	const match = bundle.entry.filter(r => r.search?.mode === "match").map(m => m.resource);
	const include = bundle.entry.filter(r => r.search?.mode === "include").map(m => m.resource);

	return [match as T, include as K];
};


