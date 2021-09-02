import Client from "fhir-kit-client";
import { Patient, Coverage, Organization, RelatedPerson, Task, Device, Practitioner, PractitionerRole, Bundle } from "fhir/r4";

export type Payor = (Organization | Patient | RelatedPerson);
export type Requester = (Device | Organization | Patient | Practitioner | PractitionerRole | RelatedPerson);
export type fetchFhirType = {
	patient: Patient | null,
	coverage: Coverage[] | null,
	task: Task[] | null,
	payor: Payor[] | null,
	requester: Requester[] | null
};

export const fetchFhirData = async (serverURI: string, token: string | null, patientId: string): Promise<fetchFhirType> => {
	const client = new Client({ baseUrl: serverURI });
	if (token) {
		client.bearerToken = token;
	}

	const patient = await client.read({ resourceType: "Patient", id: patientId });
	const coverageBundle = await client.search({ resourceType: "Coverage", searchParams: { "_patient": patientId, "_include": "Coverage:payor" } }) as Bundle;
	const [coverage, payor] = splitInclude<Coverage[], Payor[]>(coverageBundle);
	const taskBundle = await client.search({ resourceType: "Task", searchParams: { "_patient": patientId, "_include": "Task:requester" } }) as Bundle;
	const [task, requester] = splitInclude<Task[], Requester[]>(taskBundle);

	return {
		patient: patient.resourceType === "Patient" ? patient as Patient : null,
		coverage,
		payor,
		task,
		requester
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


