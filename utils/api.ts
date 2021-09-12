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
import { SearchBar } from "react-native-screens";
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

export const fetchFhirData = async (serverURI: string, token: string | null | undefined, patientId: string): Promise<fetchFhirType> => {
	const client = new Client({ baseUrl: serverURI });
	if (token) {
		client.bearerToken = token;
	}

	const [patient, coverageBundle, taskWithOwnerBundle, taskWithFocusBundle, questRespBundle] = await Promise.all([
		client.read({ resourceType: "Patient", id: patientId }),
		client.search({ resourceType: "Coverage", searchParams: { patient: patientId, _include: "Coverage:payor" } }),
		client.search({ resourceType: "Task", searchParams: { patient: patientId, _include: "Task:owner" } }),
		client.search({ resourceType: "Task", searchParams: { patient: patientId, _include: "Task:focus" } }),
		client.search({ resourceType: "QuestionnaireResponse" })
	]);
	const [coverage, payor] = splitInclude<Coverage[], Payor[]>(coverageBundle as Bundle);
	const [task, owner] = splitInclude<Task[], Owner[]>(taskWithOwnerBundle as Bundle);
	const [_, focus] = splitInclude<Task[], Focus[]>(taskWithFocusBundle as Bundle);
	const [questResp] = splitInclude<QuestionnaireResponse[], unknown>(questRespBundle as Bundle);

	return {
		patient: patient.resourceType === "Patient" ? patient as Patient : null,
		coverage,
		payor,
		task,
		owner,
		focus,
		questResp: questResp || []
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


