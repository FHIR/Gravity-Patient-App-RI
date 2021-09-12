import Client from "fhir-kit-client";
import { Bundle, Patient, ServiceRequest, Task, Organization, RelatedPerson, PractitionerRole, Practitioner } from "fhir/r4";


const openFhirUrl: string = null;
const patientFamily: string = "Racca";
const patientGiven: string[] = ["Supers"];
const patientGender: "male" | "female" | "other" | "unknown" = "male";
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

		// Create Coverage/Payor resources for insurance
		const payorOrg = await cl.create({ resourceType: "Organization", body: makePayorOrganization() }) as Organization;
		await cl.create({ resourceType: "Coverage", body: makeCoverage(p.id!, payorOrg.id!) });

		// Create referrals
		for (let i = 0; i < refferalsN; i++) {
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			const t = (await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "Patient", p.id!) })) as Task;
		}

		// Create task where owner is Organization
		if (needOrganization) {
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "Organization", payorOrg.id!) });
		}

		// Create task where owner is RelatedPerson
		if (needCaregiver) {
			const rp = await cl.create({ resourceType: "RelatedPerson", body: makeRelatedPerson(p.id!) }) as RelatedPerson;
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "RelatedPerson", rp.id!) });
		}

		// Create task where owner is Practitioner or PractitionerRole
		if (needClinicalStaff) {
			const prac = await cl.create({ resourceType: "Practitioner", body: makePractitioner() }) as Practitioner;
			const pr = await cl.create({ resourceType: "PractitionerRole", body: makePractitionerRole(payorOrg.id!, prac.id!) }) as PractitionerRole;
			const sr = (await cl.create({ resourceType: "ServiceRequest", body: mkServiceRequest(p.id!) })) as ServiceRequest;
			await cl.create({ resourceType: "Task", body: makeSRTask(p.id!, sr.id!, "PractitionerRole", pr.id!) });
		}

		// Push HVS questionnaire
		await cl.update({ resourceType: "Questionnaire", id: HVS.id, body: HVS });

		// Create assessments
		for (let i = 0; i < assessmentsN; i++) {
			await cl.create({ resourceType: "Task", body: makeQTask(p.id!, HVS.id) });
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
	]
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

const makeCoverage = (patientId: string, orgId: string) => ({
	"resourceType": "Coverage",
	"status": "active",
	"beneficiary": {
		"reference": `Patient/${patientId}`
	},
	"payor": [
		{
			"reference": `Organization/${orgId}`
		}
	]
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
				"code": "710824005",
				"display": "Assessment of health and social care needs"
			}
		]
	},
	"subject": {
		"reference": `Patient/${patientId}`
	}
});

const makeSRTask = (patientId: string, serviceRequestId: string, ownerResourceType: "Patient" | "Organization" | "RelatedPerson" | "PractitionerRole", ownerId: string) => ({
	"resourceType": "Task",
	"status": "ready",
	"intent": "proposal",
	"priority": "routine",
	"for": {
		"reference": `Patient/${patientId}`
	},
	"code": {
		"text": "Acknowledge receiving of a service request"
	},
	"focus": {
		"reference": `ServiceRequest/${serviceRequestId}`
	},
	"owner": {
		"reference": `${ownerResourceType}/${ownerId}`,
	}
});

const makeQTask = (patientId: string, questionnaireId: string) => ({
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
