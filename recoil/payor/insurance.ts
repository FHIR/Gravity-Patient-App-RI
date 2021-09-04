import payorState from "./atom";
import { selector } from "recoil";
import { Organization, Resource } from "fhir/r4";

type Insurance = {
	name: string | undefined,
	location: string | undefined,
	phone: string | undefined,
	email: string | undefined
};
//todo: create generic fhir type guard
const isOrganizationGuard = (resource: Resource): resource is Organization => resource.resourceType === "Organization";

const payorInsuranceState = selector<Insurance[]>({
	key: "payorInsuranceState",
	get: ({ get }) => {
		const payors = Object.values(get(payorState)).flatMap(v => v);

		return payors
			.map(r => ({
				name: isOrganizationGuard(r) ? r.name : r.name?.[0].text,
				location: r.address ? `${r.address[0].line}, ${r.address[0].city}, ${r.address[0].state} ${r.address[0].postalCode}, ${r.address[0].country}` : undefined,
				phone: r.telecom?.find(t => t.system === "phone")?.value,
				email: r.telecom?.find(t => t.system === "email")?.value
			}));
	}
});

export default payorInsuranceState;
