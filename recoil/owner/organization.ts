import owner from "./atom";
import { selector } from "recoil";
import { Organization as FhirOrganization, Resource } from "fhir/r4";

type Organization = {
	name: string | undefined,
	active: boolean | undefined,
	type: string | undefined,
	location: string | undefined,
	phone: string | undefined,
	website: string | undefined,
	fax: string | undefined
};

const isOrganizationGuard = (resource: Resource): resource is FhirOrganization => resource.resourceType === "Organization";

const ownerOrganizationState = selector<Organization[]>({
	key: "ownerOrganizationState",
	get: ({ get }) => {
		const owners = get(owner);

		return owners
			.filter(isOrganizationGuard)
			.map(r => ({
				name: r.name,
				active: r.active,
				type: r.type?.[0].text,
				location: r.address ? `${r.address[0].line}, ${r.address[0].city}, ${r.address[0].state} ${r.address[0].postalCode}, ${r.address[0].country}` : undefined,
				phone: r.telecom?.find(t => t.system === "phone")?.value,
				website: r.telecom?.find(t => t.system === "url")?.value,
				fax: r.telecom?.find(t => t.system === "fax")?.value
			}));
	}
});

export default ownerOrganizationState;
