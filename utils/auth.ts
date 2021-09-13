import jwtDecode, { JwtPayload } from "jwt-decode";

export const discoverAuthEndpoints = (fhirUri: string) =>
	fetch(`${fhirUri}/.well-known/smart-configuration`)
		.then(resp => resp.json())
		.then(({ authorization_endpoint, token_endpoint }) => {
			if (authorization_endpoint && token_endpoint) {
				return {
					authUri: authorization_endpoint,
					tokenUri: token_endpoint
				};
			}
			throw Error("FHIR server doesn't provide auth endpoints in /.well-known/smart-configuration JSON file");
		});


export const makeURLEncodedBody = (fields: { [key: string]: string | undefined }) =>
	Object.entries(fields)
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
		.join("&");


export type UnixTime = number

export type Session = {
	patientId: string,
	access: {
		token: string,
		expiresAt?: UnixTime
	},
	refresh?: {
		token: string,
		expiresAt?: UnixTime
	}
}


type TokenResponse = {
	access_token: string,
	expires_in?: number,
	refresh_token?: string,
	patient: string
}


type ExchangeCodeConfig = {
	code: string,
	tokenUri: string,
	clientId: string,
	redirectUri: string,
	codeVerifier: string | undefined
}

export const exchangeAuthCode = async ({ code, tokenUri, clientId, redirectUri, codeVerifier }: ExchangeCodeConfig): Promise<Session> => {
	const resp = await fetch(tokenUri, {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: makeURLEncodedBody({
			grant_type: "authorization_code",
			client_id: clientId,
			redirect_uri: redirectUri,
			code,
			code_verifier: codeVerifier
		})
	});

	return processTokenResponse(await resp.json() as TokenResponse);
};


type RefreshTokenConfig = {
	refreshToken: string,
	clientId: string,
	tokenUri: string
}

export const refreshAccessToken = async ({ refreshToken, clientId, tokenUri }: RefreshTokenConfig): Promise<Session> => {
	const resp = await fetch(tokenUri, {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		},
		body: makeURLEncodedBody({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: clientId
		})
	});
	
	return processTokenResponse(await resp.json() as TokenResponse);
};


const processTokenResponse = ({ access_token, expires_in, refresh_token, patient }: TokenResponse): Session => ({
	patientId: patient,
	access: {
		token: access_token,
		expiresAt: typeof expires_in == "number" ? Date.now() + expires_in * 1000 : undefined
	},
	refresh: refresh_token ? {
		token: refresh_token,
		expiresAt: tryExtractExpTime(refresh_token)
	} : undefined
});


const tryExtractExpTime = (token: string): number | undefined => {
	try {
		const { exp } = jwtDecode<JwtPayload>(token);
		return exp && exp * 1000;
	} catch {
		return undefined;
	}
};
