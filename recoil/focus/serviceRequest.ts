import focusState from "./atom";
import { selector } from "recoil";

const focusServiceRequestState = selector({
	key: "focusServiceRequestState",
	get: ({ get }) => {
		const focuses = Object.values(get(focusState)).flatMap(v => v);

		return focuses.filter(r => r.resourceType === "ServiceRequest");
	}
});

export default focusServiceRequestState;
