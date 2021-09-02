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
