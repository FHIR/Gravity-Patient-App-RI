import focusState from "./atom";
import { selector } from "recoil";
import { ServiceRequest } from "fhir/r4";

const focusServiceRequestState = selector<ServiceRequest[]>({
	key: "focusServiceRequestState",
	get: ({ get }) => {
		const focuses = Object.values(get(focusState)).flatMap(v => v);

		return focuses.filter((r): r is ServiceRequest => r.resourceType === "ServiceRequest");
	}
});

export default focusServiceRequestState;
