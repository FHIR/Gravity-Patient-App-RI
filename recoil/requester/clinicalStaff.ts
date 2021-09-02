import requester from "./atom";
import { selector } from "recoil";
import { PractitionerRole, Practitioner, Resource } from "fhir/r4";

type ClinicalStaff = {
	name: string | undefined,
	organization: string | undefined,
	role: string | undefined,
	location: string | undefined,
	phone: string | undefined
};

const isPractitionerGuard = (resource: Resource): resource is Practitioner => resource.resourceType === "Practitioner";
const isPractitionerRoleGuard = (resource: Resource): resource is PractitionerRole => resource.resourceType === "PractitionerRole";

const requesterClinicalStaff = selector<ClinicalStaff[]>({
	key: "requesterClinicalStaff",
	get: ({ get }) => {
		const requesters = get(requester);

		const practitioners = requesters.filter(isPractitionerGuard).map(r => ({
			name: r.name?.[0]?.text,
			//todo: where to get those for practitioner resource?
			organization: undefined,
			role: undefined,
			location: r.address?.[0].city,
			phone: r.telecom?.find(t => t.system === "phone")?.value,
		}));
		const practitionerRoles = requesters.filter(isPractitionerRoleGuard).map(r => ({
			name: r.practitioner?.display,
			organization: r.organization?.display,
			role: r.code?.[0].text,
			location: r.location?.[0].display,
			phone: r.telecom?.find(t => t.system === "phone")?.value,
		}));

		return [...practitioners, ...practitionerRoles];
	}
});

export default requesterClinicalStaff;
