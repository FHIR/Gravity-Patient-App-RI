import owner from "./atom";
import { selector } from "recoil";
import { RelatedPerson, Resource } from "fhir/r4";

type Caregiver = {
	name: string | undefined,
	relationship: string | undefined,
	organization: string | undefined,
	location: string | undefined,
	phone: string | undefined
};

const isRelatedPersonGuard = (resource: Resource): resource is RelatedPerson => resource.resourceType === "RelatedPerson";

const ownerCaregiverState = selector<Caregiver[]>({
	key: "ownerCaregiverState",
	get: ({ get }) => {
		const owners = get(owner);

		return owners
			.filter(isRelatedPersonGuard)
			.map(r => ({
				name: r.name?.[0].text,
				relationship: r.relationship?.[0].text,
				//todo: where to get org for caregiver?
				organization: undefined,
				location: r.address?.[0].city,
				phone: r.telecom?.find(t => t.system === "phone")?.value
			}));
	}
});

export default ownerCaregiverState;
