import { atom } from "recoil";
import { HealthcareService } from "fhir/r4";

const healthcareServiceState = atom<{ [serverId: string]: HealthcareService[] }>({
	key: "healthcareServiceState",
	default: {},
});

export default healthcareServiceState;
