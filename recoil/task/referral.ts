import { selector } from "recoil";
import ownedByPatient from "./ownedByPatient";
import { focusServiceRequestState } from "../focus";
import { ServiceRequest, Task } from "fhir/r4";

export type Referral = Task & { serviceRequest: ServiceRequest | undefined }

const taskReferralState = selector<Referral[]>({
	key: "taskReferralState",
	get: ({ get }) => {
		const taskOwnedByPatient = get(ownedByPatient);
		const serviceRequests = get(focusServiceRequestState);
		const referrals = taskOwnedByPatient.filter(r => r.focus?.reference?.includes("ServiceRequest"));

		return referrals.map(r => {
			const serviceRequestId = r.focus?.reference?.split("/")[1] || "";
			const serviceRequest = serviceRequests.find(sr => sr.id === serviceRequestId);

			return { ...r, serviceRequest };
		});
	}
});

export default taskReferralState;
