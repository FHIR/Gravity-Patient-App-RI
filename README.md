# Gravity-Patient-App-RI
Reference implementation for Gravity exchange workflow described at [https://build.fhir.org/ig/HL7/fhir-sdoh-clinicalcare/exchange_workflow.html#direct-referral-light](https://build.fhir.org/ig/HL7/fhir-sdoh-clinicalcare/exchange_workflow.html#direct-referral-light)

## Published Expo App
#### Install the Expo Go App not from the AppStore/PlayStore, but download and install a previous version:

Android: [https://d1ahtucjixef4r.cloudfront.net/Exponent-2.23.2.apk](https://d1ahtucjixef4r.cloudfront.net/Exponent-2.23.2.apk)

iOS: [https://dpq5q02fu5f55.cloudfront.net/Exponent-2.23.2.tar.gz](https://dpq5q02fu5f55.cloudfront.net/Exponent-2.23.2.tar.gz)

#### Link to published expo app:

iOS: [https://expo.dev/@khlukanets/Gravity-Patient-App-RI/--/import-server?title=Logica&fhirUri=https%3A%2F%2Fapi.logicahealth.org%2FGravitySandboxNew%2Fdata&clientId=e501d8e5-d742-462b-bf27-669e385ec243](https://expo.dev/@khlukanets/Gravity-Patient-App-RI/--/import-server?title=Logica&fhirUri=https%3A%2F%2Fapi.logicahealth.org%2FGravitySandboxNew%2Fdata&clientId=e501d8e5-d742-462b-bf27-669e385ec243)

Android: [exp://exp.host/@f8473d26/Gravity-Patient-App-RI/--/import-server?title=Logica&fhirUri=https%3A%2F%2Fapi.logicahealth.org%2FGravitySandboxNew%2Fdata&clientId=e501d8e5-d742-462b-bf27-669e385ec243](exp://exp.host/@f8473d26/Gravity-Patient-App-RI/--/import-server?title=Logica&fhirUri=https%3A%2F%2Fapi.logicahealth.org%2FGravitySandboxNew%2Fdata&clientId=e501d8e5-d742-462b-bf27-669e385ec243)

#### Open Expo Go app and scan QR code to launch the app.


*Note for iOS users* Due to iOS restriction settings you cannot always open published expo app, please follow the link [https://docs.expo.dev/workflow/publishing/#on-ios-you-cant-share-your-published](https://docs.expo.dev/workflow/publishing/#on-ios-you-cant-share-your-published)

#### User credentials for app login:
* Patient / password
* Caregiver / password

## Local Development
### Requirements:
* Node.js 12+
* Expo-cli `npm i -g expo-cli`

### Run
`npm run start`
This will start local version of expo with its own QR code to scan from Expo Go app.

## Prepare Data
This app works with [https://github.com/FHIR/Gravity-SDOH-Exchange-RI](https://github.com/FHIR/Gravity-SDOH-Exchange-RI). With that web application you can create the correct data, of course, using a shared sandbox

To authenticate correctly your sandbox app should have proper redirectURI `https://auth.expo.io/@khlukanets/Gravity-Patient-App-RI` and scopes `patient/*.* launch/patient offline_access`

To generate correct linking url (the one that you click in your email) please refer to this as example:
`exp://exp.host/@khlukanets/Gravity-Patient-App-RI/--/import-server?title=Logica&fhirUri=https%253A%252F%252Fapi.logicahealth.org%252FGravitySandboxNew%252Fdata&clientId=e501d8e5-d742-462b-bf27-669e385ec243`
where:
* `title` is your server title (could be whatever)
* `fhirUri` your secured fhir endpoint
* `clientId` client id of your sandbox app

If you are running the app dev locally please refer to `logicaParams` variable in `App.tsx` and enter your `title | fhirUri | clientId` there. After app starts you will get console.log with correct linking.
Or you can always enter those params manually from Create New Server screen and don't bother with linking process.

## Outcome questions
In this app we created fake loinc answer/question for outcome section.
`99999-1` *Did the service meet your needs?*
`LA33-6` *Yes*
`LA32-8` *No*
`99997-3` *Did the available food meet your immediate needs?*
`LA33-6` *Yes*
`LA32-8` *No*
`99996-4` *Was the available food ethnically appropriate?*
`LA33-6` *Yes*
`LA32-8` *No*
`LA4489-6` *Unknown*
`99981-1` *Why did you cancel / not use the service?*
`LA991-1` *No longer needed*
`LA992-2` *Unwilling to use this type of service*
`LA993-3` *Unable to schedule appointment*
`LA994-4` *Unable to arrange transportation*
`LA995-5` *Do not feel safe using the organization*
`LA996-6` *Receive negative feedback on this organization*
`LA997-7` *Explain*
`99982-2` *Do you want to reschedule the service?*
`LA33-6` *Yes*
`LA32-8` *No*
`99983-3` *Would you use the service again?*
`LA33-6` *Yes*
`LA32-8` *No*

## FHIR Resource examples
### Referral
```json
{
	"resourceType": "Task",
	"id": "15103",
	"meta": {
		"versionId": "2",
		"lastUpdated": "2021-09-14T18:45:22.000+00:00",
		"source": "#QmfUUgR7BaXtjtdj"
	},
	"status": "completed",
	"intent": "proposal",
	"priority": "routine",
	"description": "Consultation with RDN",
	"input" : [
		{
			"type" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
						"code" : "questionnaire",
						"display" : "Questionnaire"
					}
				]
			}
		},
		{
			"type" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
						"code" : "questionnaire-category",
						"display" : "Questionnaire Category"
					}
				]
			},
			"valueCodeableConcept" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
						"code" : "feedback-questionnaire",
						"display" : "Feedback Questionnaire"
					}
				]
			}
		}
	],
	"for": {
		"reference": "Patient/15098"
	},
	"partOf": [{
			"reference": "Task/1234566"
	}],
	"authoredOn": "2021-09-14T16:20:30.215Z",
	"lastModified": "2021-09-14T18:45:21.730Z",
	"requester": {
		"reference": "Organization/15099",
		"display": "Coordination Platform"
	},
	"owner": {
		"reference": "Patient/15098"
	},
	"output": [{
			"type": {
				"coding": [{
					"system": "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
					"code": "questionnaire-response",
					"display": "Questionnaire Response"
				}]
			},
			"valueReference": {
				"reference": "QuestionnaireResponse/15120"
			}
	}]
}
```

### Assessment
```json
{
	"resourceType": "Task",
	"id": "15115",
	"meta": {
		"versionId": "2",
		"lastUpdated": "2021-09-14T18:45:33.000+00:00",
		"source": "#unukn7jp1JWZYa7p"
	},
	"status": "completed",
	"intent": "proposal",
	"priority": "routine",
	"description": "Complete a questionnaire",
	"input" : [
		{
			"type" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
						"code" : "questionnaire",
						"display" : "Questionnaire"
					}
				]
			},
			"valueCanonical" : "http://hl7.org/fhir/us/sdoh-clinicalcare/Questionnaire/SDOHCC-QuestionnaireHungerVitalSign"
		},
		{
			"type" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
						"code" : "questionnaire-category",
						"display" : "Questionnaire Category"
					}
				]
			},
			"valueCodeableConcept" : {
				"coding" : [
					{
						"system" : "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
						"code" : "risk-questionnaire",
						"display" : "Risk Questionnaire"
					}
				]
			}
		}
	],
	"for": {
		"reference": "Patient/15098"
	},
	"authoredOn": "2021-09-14T16:20:40.723Z",
	"requester": {
		"reference": "Organization/15099",
		"display": "Coordination Platform"
	},
	"owner": {
		"reference": "Patient/15098"
	},
	"restriction": {
		"period": {
			"end": "2021-09-15T16:20:40.723Z"
		}
	},
	"output": [
		{
			"type": {
				"coding": [
					{
						"system": "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
						"code": "questionnaire-response",
						"display": "Questionnaire Response"
					}
				]
			},
			"valueReference": {
				"reference": "QuestionnaireResponse/15120"
			}
		}
	]
}
```

### output QuestionnaireResponse
```json
{
    "resourceType": "QuestionnaireResponse",
    "id": "15120",
    "meta": {
        "versionId": "1",
        "lastUpdated": "2021-09-14T18:45:33.000+00:00",
        "source": "#xvB4P3eXqd8DuMwA"
    },
    "questionnaire": "Questionnaire/questionnaire-sdc-profile-example-hunger-vital-signs",
    "status": "completed",
	"subject" : {
		"reference": "Patient/15098",
		"display": "Racca Supers"
	},
	"authored" : "2021-09-14T18:45:32.003Z",
	"source" : {
		"reference": "Patient/15098",
		"display": "Racca Supers"
	},
    "item": [
        {
            "linkId": "/88122-7",
            "text": "Within the past 12Mo we worried whether our food would run out before we got money to buy more",
            "answer": [
                {
                    "valueCoding": {
                        "system": "http://loinc.org",
                        "code": "LA28397-0",
                        "display": "Often true"
                    }
                }
            ]
        },
        {
            "linkId": "/88123-5",
            "text": "Within the past 12Mo the food we bought just didn't last and we didn't have money to get more",
            "answer": [
                {
                    "valueCoding": {
                        "system": "http://loinc.org",
                        "code": "LA6729-3",
                        "display": "Sometimes true"
                    }
                }
            ]
        },
        {
            "linkId": "/88124-3",
            "text": "Food insecurity risk",
            "answer": [
                {
                    "valueCoding": {
                        "system": "http://loinc.org",
                        "code": "LA19952-3",
                        "display": "At risk"
                    }
                }
            ]
        }
    ]
}
```
