import Client from "fhir-kit-client";
import { Bundle, Patient, ServiceRequest, Task, Organization, RelatedPerson, PractitionerRole, Practitioner } from "fhir/r4";


const openFhirUrl: string = null;
const patientFamily: string = "Racca";
const patientGiven: string[] = ["Supers"];
const patientGender: "male" | "female" | "other" | "unknown" = "female";
const refferalsN = 3;
const assessmentsN = 3;
const needOrganization = true;
const needCaregiver = true;
const needClinicalStaff = true;

const cl = new Client({ baseUrl: openFhirUrl });


const go = async () => {
	try {
		// Delete patient if exists
		const res = await cl.resourceSearch({ resourceType: "Patient", searchParams: { family: patientFamily, given: patientGiven[0]! } });
		const b = res as Bundle;
		if (b.total) {
			const p = b.entry![0]!.resource as Patient;
			await cl.delete({ resourceType: "Patient", id: p.id!, options: { _cascade: "delete", headers: { "X-Cascade": "delete" } } });
		}

		// Create new patient
		const p = (await cl.create({ resourceType: "Patient", body: PATIENT })) as Patient;
		const cpOrg = await cl.create({ resourceType: "Organization", body: makeCPOrganization() }) as Organization;

		// Create Coverage/Payor resources for insurance
		const payorOrg = await cl.create({ resourceType: "Organization", body: makePayorOrganization() }) as Organization;
		await cl.create({ resourceType: "Coverage", body: makeCoverage(p.id!, payorOrg.id!) });

		// Create referrals
		for (let i = 0; i < refferalsN; i++) {
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			const t = (await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "Patient", p.id!, cpOrg.id!, cpOrg.name!) })) as Task;
		}

		// Create task where owner is Organization
		if (needOrganization) {
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "Organization", payorOrg.id!, cpOrg.id!, cpOrg.name!) });
		}

		// Create task where owner is RelatedPerson
		if (needCaregiver) {
			const rp = await cl.create({ resourceType: "RelatedPerson", body: makeRelatedPerson(p.id!) }) as RelatedPerson;
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "RelatedPerson", rp.id!, cpOrg.id!, cpOrg.name!) });
		}

		// Create task where owner is Practitioner or PractitionerRole
		if (needClinicalStaff) {
			const prac = await cl.create({ resourceType: "Practitioner", body: makePractitioner() }) as Practitioner;
			const pr = await cl.create({ resourceType: "PractitionerRole", body: makePractitionerRole(payorOrg.id!, prac.id!) }) as PractitionerRole;
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "PractitionerRole", pr.id!, cpOrg.id!, cpOrg.name!) });
		}

		// Push HVS questionnaire
		await cl.update({ resourceType: "Questionnaire", id: HVS.id, body: HVS });

		// Create assessments
		for (let i = 0; i < assessmentsN; i++) {
			await cl.create({ resourceType: "Task", body: makeQTask(p.id!, HVS.id, cpOrg.id!, cpOrg.name!) });
		}

	} catch(err) {
		console.log(JSON.stringify(err, null, 2));
	}
};

go();



const PATIENT = {
	"resourceType": "Patient",
	"name": [
		{
			"use": "usual",
			"family": patientFamily,
			"given": patientGiven,
			"period": {
				"start": "2020-07-22"
			}
		}
	],
	"identifier": [
		{
			"use": "usual",
			"type": {
				"coding": [
					{
						"system": "http://terminology.hl7.org/CodeSystem/v2-0203",
						"code": "MR",
						"display": "Medical Record Number"
					}
				],
				"text": "Medical Record Number"
			},
			"system": "http://hospital.smarthealthit.org",
			"value": "1032702"
		}
	],
	"active": true,
	"telecom": [
		{
			"system": "phone",
			"value": "555-555-5555",
			"use": "home"
		},
		{
			"system": "phone",
			"value": "0648352638",
			"use": "mobile"
		},
		{
			"system": "email",
			"value": "mail@example.com",
			"use": "home"
		},
		{
			"system": "email",
			"value": "mail@work.com",
			"use": "work"
		}
	],
	"gender": patientGender,
	"birthDate": "1987-02-20",
	"address": [
		{
			"use": "home",
			"line": [
				"49 Meadow St"
			],
			"city": "Mounds",
			"state": "OK",
			"postalCode": "74047",
			"country": "US",
			"period": {
				"start": "2016-12-06",
				"end": "2020-07-22"
			}
		},
		{
			"use": "home",
			"line": [
				"183 Mountain View St"
			],
			"city": "Mounds",
			"state": "OK",
			"postalCode": "74048",
			"country": "US",
			"period": {
				"start": "2020-07-22"
			}
		}
	],
	"maritalStatus": {
		"coding": [
			{
				"system": "http://terminology.hl7.org/ValueSet/v3-MaritalStatus",
				"code": "U",
				"display": "unmarried"
			}
		],
	},
	"communication": [
		{
			"language": {
				"coding": [
					{
						"system": "urn:ietf:bcp:47",
						"code": "en",
						"display": "English"
					}
				],
			},
			"preferred": true
		}
	],
	"extension": [
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
			"extension": [
				{
					"url": "ombCategory",
					"valueCoding": {
						"system": "urn:oid:2.16.840.1.113883.6.238",
						"code": "2106-3",
						"display": "White"
					}
				},
				{
					"url": "text",
					"valueString": "White"
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
			"extension": [
				{
					"url": "ombCategory",
					"valueCoding": {
						"system": "urn:oid:2.16.840.1.113883.6.238",
						"code": "2186-5",
						"display": "Not Hispanic or Latino"
					}
				},
				{
					"url": "text",
					"valueString": "Not Hispanic or Latino"
				}
			]
		},
		{
			"url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
			"valueCode": "Unknown"
		}
	],
	photo: [{
		contentType: "image/png",
		data: "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"
	}]
}

const makePayorOrganization = () => ({
	"resourceType": "Organization",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n      \n      <p>Blue Insurance</p>\n    \n    </div>"
	},
	"identifier": [
		{
			"system": "urn:oid:2.16.840.1.113883.3.19.2.3",
			"value": "666666"
		}
	],
	"name": "Blue Insurance",
	"alias": [
		"ABC Insurance"
	],
	"telecom": [
		{
			"system": "phone",
			"value": "(+1) 734-677-7777"
		},
		{
			"system": "fax",
			"value": "(+1) 734-677-6622"
		},
		{
			"system": "email",
			"value": "hq@HL7.org"
		},
		{
			"system": "url",
			"value": "https://www.blueshieldca.com"
		}
	],
	"address": [
		{
			"line": [
				"3300 Washtenaw Avenue, Suite 227"
			],
			"city": "Ann Arbor",
			"state": "MI",
			"postalCode": "48104",
			"country": "USA"
		}
	],
	"active": true,
	"type": [
		{
			"coding": [
				{
					"system": "http://terminology.hl7.org/CodeSystem/organization-type",
					"code": "dept",
					"display": "Hospital Department"
				}
			]
		}
	],
});

const makeCPOrganization = () => ({
	"resourceType": "Organization",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n      \n      <p>Coordination Platform</p>\n    \n    </div>"
	},
	"name": "Coordination Platform",
	"active": true,
	"type": [
		{
			"coding": [
				{
					"system": "http://hl7.org/gravity/CodeSystem/sdohcc-temporary-organization-type-codes",
					"code": "cp",
					"display": "Coordination Platform"
				}
			]
		}
	]
});

const makeCoverage = (patientId: string, orgId: string) => ({
	"resourceType": "Coverage",
	"status": "active",
	"beneficiary": {
		"reference": `Patient/${patientId}`
	},
	"subscriber": {
		"reference": `Patient/${patientId}`
	},
	"subscriberId": "AB9876",
	"payor": [
		{
			"reference": `Organization/${orgId}`
		}
	],
	"relationship": {
		"coding": [
			{
				"code": "self"
			}
		]
	}
});

const makeRelatedPerson = (patientId: string) => ({
	"resourceType": "RelatedPerson",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: newborn-mom</p><p><b>identifier</b>: Social Security number = 444222222</p><p><b>active</b>: true</p><p><b>patient</b>: <a>Patient/newborn</a></p><p><b>relationship</b>: Natural Mother <span>(Details : {http://terminology.hl7.org/CodeSystem/v3-RoleCode code 'NMTH' = 'natural mother', given as 'natural mother'})</span></p><p><b>name</b>: Eve Everywoman (OFFICIAL)</p><p><b>telecom</b>: ph: 555-555-2003(WORK)</p><p><b>gender</b>: female</p><p><b>birthDate</b>: 31/05/1973</p><p><b>address</b>: 2222 Home Street (HOME)</p></div>"
	},
	"identifier": [
		{
			"type": {
				"coding": [
					{
						"system": "http://terminology.hl7.org/CodeSystem/v2-0203",
						"code": "SS"
					}
				]
			},
			"system": "http://hl7.org/fhir/sid/us-ssn",
			"value": "444222222"
		}
	],
	"active": true,
	"patient": {
		"reference": `Patient/${patientId}`
	},
	"address": [
		{
			"line": [
				"43, Place du Marché Sainte Catherine"
			],
			"city": "Paris",
			"postalCode": "75004",
			"country": "FRA"
		}
	],
	"relationship": [
		{
			"coding": [
				{
					"system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
					"code": "NMTH",
					"display": "natural mother"
				}
			],
			"text": "Natural Mother"
		}
	],
	"name": [
		{
			"use": "official",
			"family": "Everywoman",
			"given": [
				"Eve"
			],
			"text": "Eve Everywoman"
		}
	],
	"telecom": [
		{
			"system": "phone",
			"value": "555-555-2003",
			"use": "work"
		}
	],
	"gender": "female",
	"birthDate": "1973-05-31"
});

const makePractitioner = () => ({
	"resourceType": "Practitioner",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n      <p>Dr Adam Careful is a Referring Practitioner for Acme Hospital from 1-Jan 2012 to 31-Mar\n        2012</p>\n    </div>"
	},
	"identifier": [
		{
			"system": "http://www.acme.org/practitioners",
			"value": "23"
		}
	],
	"active": true,
	"name": [
		{
			"family": "Careful",
			"given": [
				"Adam"
			],
			"prefix": [
				"Dr"
			]
		}
	],
	"address": [
		{
			"use": "home",
			"line": [
				"534 Erewhon St"
			],
			"city": "PleasantVille",
			"state": "Vic",
			"postalCode": "3999"
		}
	],
	"qualification": [
		{
			"identifier": [
				{
					"system": "http://example.org/UniversityIdentifier",
					"value": "12345"
				}
			],
			"code": {
				"coding": [
					{
						"system": "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
						"code": "BS",
						"display": "Bachelor of Science"
					}
				],
				"text": "Bachelor of Science"
			},
			"period": {
				"start": "1995"
			},
			"issuer": {
				"display": "Example University"
			}
		}
	]
});

const makePractitionerRole = (orgId: string, pracId: string) => ({
	"resourceType": "PractitionerRole",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n            <span style=\"color: gray;\">practitioner:</span> Ronald Briet<br/><span style=\"color: gray;\">organization:</span> BMC<br/><span style=\"color: gray;\">role:</span> Care role\n          </div>"
	},
	"organization": {
		"reference": `Organization/${orgId}`,
		"display": "BMC"
	},
	"practitioner": {
		"reference": `Practitioner/${pracId}`,
		"display": "Dr. Careful"
	},
	"code": [
		{
			"coding": [
				{
					"system": "urn:oid:2.16.840.1.113883.2.4.15.111",
					"code": "01.000",
					"display": "Arts"
				}
			],
			"text": "Care role"
		}
	],
	"specialty": [
		{
			"coding": [
				{
					"system": "urn:oid:2.16.840.1.113883.2.4.15.111",
					"code": "01.018",
					"display": "Ear-, Nose and Throat"
				}
			],
			"text": "specialization"
		}
	],
	"location": [
		{
			"display": "South Wing, second floor"
		}
	],
	"telecom": [
		{
			"system": "phone",
			"value": "555 123456",
			"use": "mobile"
		}
	]
});

const mkServiceRequest = (patientId: string) => ({
	"resourceType": "ServiceRequest",
	"status": "active",
	"intent": "order",
	"category": [
		{
			"coding": [
				{
					"system": "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/sdohcc-temporary-codes",
					"code": "food-insecurity",
					"display": "Food Insecurity"
				}
			]
		}
	],
	"priority": "urgent",
	"code": {
		"coding": [
			{
				"system": "http://snomed.info/sct",
				"code": "710925007",
				"display": "Provision of Food"
			}
		]
	},
	"subject": {
		"reference": `Patient/${patientId}`
	},
	"occurrenceDateTime": new Date(Date.now() + 24 * 3600 * 1000).toISOString()
});

const makeSRTask = (patientId: string, serviceRequestId: string, ownerResourceType: "Patient" | "Organization" | "RelatedPerson" | "PractitionerRole", ownerId: string, requesterId: string, requesterDisplay: string) => ({
	"resourceType": "Task",
	"status": "ready",
	"intent": "proposal",
	"priority": "routine",
	"authoredOn": new Date().toISOString(),
	"for": {
		"reference": `Patient/${patientId}`
	},
	"code": {
		"text": "Consultation with RDN"
	},
	"focus": {
		"reference": `ServiceRequest/${serviceRequestId}`
	},
	"owner": {
		"reference": `${ownerResourceType}/${ownerId}`,
	},
	requester: {
		"reference": `Organization/${requesterId}`,
		display: requesterDisplay
	}
});

const makeQTask = (patientId: string, questionnaireId: string, requesterId: string, requesterDisplay: string) => ({
	"resourceType": "Task",
	"status": "ready",
	"intent": "proposal",
	"priority": "routine",
	"authoredOn": new Date().toISOString(),
	"restriction": {
		"period": {
			"end": new Date(Date.now() + 24 * 3600 * 1000).toISOString()
		}
	},
	"for": {
		"reference": `Patient/${patientId}`
	},
	"code": {
		"text": "Complete a questionnaire"
	},
	"focus": {
		"reference": `Questionnaire/${questionnaireId}`
	},
	"owner": {
		"reference": `Patient/${patientId}`,
	},
	requester: {
		"reference": `Organization/${requesterId}`,
		display: requesterDisplay
	}
});

const HVS = {
  "resourceType" : "Questionnaire",
  "id" : "questionnaire-sdc-profile-example-hunger-vital-signs",
  "meta" : {
	"profile" : [
	  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7"
	],
	"tag" : [
	  {
		"code" : "lformsVersion: 25.0.0"
	  }
	]
  },
  "extension" : [
	{
	  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
	  "valueExpression" : {
		"name" : "worriedAnsCode",
		"language" : "text/fhirpath",
		"expression" : "%resource.item.where(linkId='/88122-7').answer.value.code"
	  }
	},
	{
	  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
	  "valueExpression" : {
		"name" : "ranOutAnsCode",
		"language" : "text/fhirpath",
		"expression" : "%resource.item.where(linkId='/88123-5').answer.value.code"
	  }
	},
	{
	  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
	  "valueExpression" : {
		"name" : "riskCodes",
		"language" : "text/fhirpath",
		"expression" : "'LA28397-0'.combine('LA6729-3')"
	  }
	},
	{
	  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
	  "valueExpression" : {
		"name" : "riskStatus",
		"language" : "text/fhirpath",
		"expression" : "%riskCodes contains %worriedAnsCode or %riskCodes contains %ranOutAnsCode"
	  }
	},
	{
	  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
	  "valueExpression" : {
		"name" : "answeredEitherQ",
		"language" : "text/fhirpath",
		"expression" : "%worriedAnsCode.exists() or %ranOutAnsCode.exists()"
	  }
	}
  ],
  "url" : "http://hl7.org/fhir/uv/sdc/Questionnaire/questionnaire-sdc-profile-example-hunger-vital-signs",
  "version" : "2.8.0",
  "title" : "Hunger Vital Sign [HVS]",
  "status" : "draft",
  "subjectType" : [
	"Person"
  ],
  "date" : "2021-09-02T18:28:59+00:00",
  "publisher" : "HL7 International - FHIR Infrastructure Work Group",
  "contact" : [
	{
	  "telecom" : [
		{
		  "system" : "url",
		  "value" : "http://hl7.org/Special/committees/fiwg"
		}
	  ]
	}
  ],
  "description" : "A hunger vital signs form (showing calculatedExpression selecting a value from a list).",
  "jurisdiction" : [
	{
	  "coding" : [
		{
		  "system" : "http://unstats.un.org/unsd/methods/m49/m49.htm",
		  "code" : "001"
		}
	  ]
	}
  ],
  "code" : [
	{
	  "code" : "88121-9",
	  "display" : "Hunger Vital Sign [HVS]"
	}
  ],
  "item" : [
	{
	  "extension" : [
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
		  "valueCodeableConcept" : {
			"coding" : [
			  {
				"system" : "http://hl7.org/fhir/questionnaire-item-control",
				"code" : "drop-down",
				"display" : "Drop down"
			  }
			],
			"text" : "Drop down"
		  }
		}
	  ],
	  "linkId" : "/88122-7",
	  "code" : [
		{
		  "code" : "88122-7",
		  "display" : "Within the past 12Mo we worried whether our food would run out before we got money to buy more"
		}
	  ],
	  "text" : "Within the past 12Mo we worried whether our food would run out before we got money to buy more",
	  "type" : "choice",
	  "required" : false,
	  "answerOption" : [
		{
		  "valueCoding" : {
			"code" : "LA28397-0",
			"display" : "Often true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA6729-3",
			"display" : "Sometimes true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA28398-8",
			"display" : "Never true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA15775-2",
			"display" : "Don't know/refused"
		  }
		}
	  ]
	},
	{
	  "extension" : [
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
		  "valueCodeableConcept" : {
			"coding" : [
			  {
				"system" : "http://hl7.org/fhir/questionnaire-item-control",
				"code" : "drop-down",
				"display" : "Drop down"
			  }
			],
			"text" : "Drop down"
		  }
		}
	  ],
	  "linkId" : "/88123-5",
	  "code" : [
		{
		  "code" : "88123-5",
		  "display" : "Within the past 12Mo the food we bought just didn't last and we didn't have money to get more"
		}
	  ],
	  "text" : "Within the past 12Mo the food we bought just didn't last and we didn't have money to get more",
	  "type" : "choice",
	  "required" : false,
	  "answerOption" : [
		{
		  "valueCoding" : {
			"code" : "LA28397-0",
			"display" : "Often true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA6729-3",
			"display" : "Sometimes true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA28398-8",
			"display" : "Never true"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA15775-2",
			"display" : "Don't know/refused"
		  }
		}
	  ]
	},
	{
	  "extension" : [
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
		  "valueCodeableConcept" : {
			"coding" : [
			  {
				"system" : "http://hl7.org/fhir/questionnaire-item-control",
				"code" : "drop-down",
				"display" : "Drop down"
			  }
			],
			"text" : "Drop down"
		  }
		},
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
		  "valueExpression" : {
			"name" : "thisItem",
			"language" : "text/fhirpath",
			"expression" : "%questionnaire.item.where(linkId = '/88124-3')"
		  }
		},
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
		  "valueExpression" : {
			"name" : "atRiskCoding",
			"language" : "text/fhirpath",
			"expression" : "%thisItem.answerOption.valueCoding.where(code='LA19952-3')"
		  }
		},
		{
		  "url" : "http://hl7.org/fhir/StructureDefinition/variable",
		  "valueExpression" : {
			"name" : "noRiskCoding",
			"language" : "text/fhirpath",
			"expression" : "%thisItem.answerOption.valueCoding.where(code='LA19983-8')"
		  }
		},
		{
		  "url" : "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
		  "valueExpression" : {
			"description" : "risk determination",
			"language" : "text/fhirpath",
			"expression" : "iif(%answeredEitherQ, iif(%riskStatus, %atRiskCoding, %noRiskCoding), {})"
		  }
		}
	  ],
	  "linkId" : "/88124-3",
	  "code" : [
		{
		  "code" : "88124-3",
		  "display" : "Food insecurity risk"
		}
	  ],
	  "text" : "Food insecurity risk",
	  "type" : "choice",
	  "required" : false,
	  "readOnly" : true,
	  "answerOption" : [
		{
		  "valueCoding" : {
			"code" : "LA19952-3",
			"display" : "At risk"
		  }
		},
		{
		  "valueCoding" : {
			"code" : "LA19983-8",
			"display" : "No risk"
		  }
		}
	  ],
	  "item" : [
		{
		  "extension" : [
			{
			  "url" : "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
			  "valueCodeableConcept" : {
				"coding" : [
				  {
					"system" : "http://hl7.org/fhir/questionnaire-item-control",
					"code" : "help",
					"display" : "Help-Button"
				  }
				],
				"text" : "Help-Button"
			  }
			}
		  ],
		  "linkId" : "/88124-3-help",
		  "text" : "An answer of \"often true\" or \"sometimes true\" to either or both of the Hunger Vital Sign™ questions identifies a patient as at risk for food insecurity (FI).",
		  "type" : "display"
		}
	  ]
	}
  ]
}
