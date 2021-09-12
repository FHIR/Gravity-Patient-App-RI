import { atom } from "recoil";

export type ImportServerRequest = {
	title: string,
	fhirUri: string,
	clientId: string
}

export const pendingServerImport = atom<ImportServerRequest | undefined>({
	key: "pendingServerImport",
	default: undefined
});
