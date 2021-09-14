import coverageState from "./atom";
import payorState from "../payor";
import { selector } from "recoil";
import { Organization, Resource } from "fhir/r4";

type Insurance = {
	subscriberId: string | undefined
	name: string | undefined,
	location: string | undefined,
	phone: string | undefined,
	email: string | undefined
};
//todo: create generic fhir type guard
const isOrganizationGuard = (resource: Resource): resource is Organization => resource.resourceType === "Organization";

const coverageInsuranceState = selector<Insurance[]>({
	key: "coverageInsuranceState",
	get: ({ get }) => {
		const coverages = Object.values(get(coverageState)).flatMap(v => v);
		const payors = Object.values(get(payorState)).flatMap(v => v);

		return coverages
			.map(r => {
				const payorId = r.payor?.[0].reference?.split("/")[1] || "";
				const payor = payors.find(p => p.id === payorId);

				return {
					subscriberId: r.subscriberId,
					name: payor && isOrganizationGuard(payor) ? payor.name : payor?.name?.[0].text,
					location: payor?.address ? `${payor.address[0].line}, ${payor.address[0].city}, ${payor.address[0].state} ${payor.address[0].postalCode}, ${payor.address[0].country}` : undefined,
					phone: payor?.telecom?.find(t => t.system === "phone")?.value,
					email: payor?.telecom?.find(t => t.system === "email")?.value
				}
			});
	}
});

export default coverageInsuranceState;
