import { FormControl, HStack, Select, Text, TextArea, View, Button, Radio } from "native-base";
import React, { useState, useEffect } from "react";
import { Referral } from "../../recoil/task/referral";
import Card from "../Card";
import { useRecoilState, useRecoilValue } from "recoil";
import { serversState } from "../../recoil/servers";
import Client from "fhir-kit-client";
import patientState from "../../recoil/patient";
import { Bundle, Observation, ServiceRequest } from "fhir/r4";
import taskState from "../../recoil/task";
import { splitInclude } from "../../utils/api";

const LOINC_CODES_MAP: { [code: string]: string } = {
	"LA33-6": "Yes",
	"LA32-8": "No",
	"LA4489-6": "Unknown",
	"LA991-1": "No longer needed",
	"LA992-2": "Unwilling to use this type of service",
	"LA993-3": "Unable to schedule appointment",
	"LA994-4": "Unable to arrange transportation",
	"LA995-5": "Do not feel safe using the organization",
	"LA996-6": "Receive negative feedback on this organization",
	"LA997-7": "Explain please"
};

const makeOutputObservation = ({ patientId, serviceRequestId, question, answer }: { patientId: string | undefined, serviceRequestId: string | undefined, question: { code: string, display: string }, answer: { code: string, display: string } }): Observation => ({
	"resourceType": "Observation",
	"text": {
		"status": "generated",
		"div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><p></p><p><b>category</b>: <span title=\"Codes: {http://terminology.hl7.org/CodeSystem/observation-category social-history}\">Social History</span>, <span title=\"Codes: {http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes transportation-insecurity}, {http://example.org/CodeSystem/other-code-system transportation-insecurity-financial}\">Transportation Insecurity</span></p><p><b>code</b>: <span title=\"Codes: {http://snomed.info/sct 160695008}\">Transport too expensive</span></p><p><b>subject</b>: <a href=\"Patient-pat-53234.html\">COLIN ABBAS. Generated Summary: Medical Record Number: 1032702 (USUAL); active; COLIN V. ABBAS , COLIN V. BAXTER ; Phone: 555-555-5555; gender: male; birthDate: 1987-02-20</a></p><p><b>effective</b>: May 10, 2021, 9:56:54 PM</p><p><b>value</b>: true</p></div>"
	},
	"meta": {
		"profile": [
			"http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-ObservationAssessment"
		]
	},
	"status": "final",
	"category": [
		{
			"coding": [
				{
					"system": "http://terminology.hl7.org/CodeSystem/observation-PatientReportedOutcomes",
					"code": "Patient-feedback",
					"display": "Patient Feedback"
				}
			]
		},
		{
			"coding": [
				{
					"system": "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/SDOHCC-CodeSystemTemporaryCodes",
					"code": "food-insecurity",
					"display": "food Insecurity"
				}
			]
		}
	],
	"code": {
		"coding": [
			{
				"system": "http://loinc.org",
				"code": question.code,
				"display": question.display
			}
		]
	},
	"subject": {
		"reference": `Patient/${patientId}`
	},
	"basedOn": [
		{
			"reference": `ServiceRequest/${serviceRequestId}`
		}
	],
	"valueCodeableConcept": {
		"coding": [
			{
				"system": "http://loinc.org",
				"code": answer.code,
				"display": answer.display
			}
		],
		"text": answer.display
	}
});

const makeOutput = (value: any) => ({
	"type": {
		"coding": [
			{
				"system": "http://hl7.org/fhir/us/sdoh-clinicalcare/CodeSystem/sdohcc-temporary-codes",
				"code": "resulting-activity",
				"display": "Resulting Activity"
			}
		]
	},
	...value
});

const ReferralOutcome = ({ referral }: { referral: Referral }): JSX.Element => {
	const [status, setStatus] = useState<string>("");
	const [comment, setComment] = useState<string>("");
	const [successQ1, setSuccessQ1] = useState<string>("");
	const [successQ2, setSuccessQ2] = useState<string>("");
	const [successQ3, setSuccessQ3] = useState<string>("");
	const [failedQ1, setFailedQ1] = useState<string>("");
	const [failedQ2, setFailedQ2] = useState<string>("");
	const [failedQ3, setFailedQ3] = useState<string>("");

	const servers = useRecoilValue(serversState);
	const [primaryPatient] = Object.values(useRecoilValue(patientState));
	//todo: fix ts warning
	const referralServer = servers[referral.serverId];
	const [tasks, setTasks] = useRecoilState(taskState);
	const isSubmitted = ["rejected", "cancelled", "on-hold", "failed", "completed", "entered-in-error"].includes(referral.status);
	const [submitInProgress, setSubmitInProgress] = useState(false);
	const [outcomeObservations, setOutcomeObservation] = useState<{ question: string | undefined, answer: string | undefined }[] | undefined>([]);

	useEffect(() => {
		const fetchObservation = async () => {
			const client = new Client({ baseUrl: referralServer.fhirUri });
			client.bearerToken = referralServer.session?.access.token;
			const bundle = await client.search({ resourceType: "ServiceRequest", searchParams: { _id: referral.serviceRequest?.id, _revinclude: "Observation:based-on" } }) as Bundle;
			const [_, observation] = splitInclude<ServiceRequest[], Observation[]>(bundle);

			const outcomeObservation = observation?.map((r): { question: string | undefined, answer: string | undefined } => ({
				question: r.code.coding?.[0].display,
				answer: r.valueCodeableConcept?.coding?.[0].display
			}));

			setOutcomeObservation(outcomeObservation);
		};

		if (isSubmitted) {
			fetchObservation();
		}
	}, [isSubmitted])


	useEffect(() => {
		setComment("");
	}, [status]);

	const handleSubmit = async () => {
		try {
			setSubmitInProgress(true);
			const client = new Client({ baseUrl: referralServer.fhirUri });
			client.bearerToken = referralServer.session?.access.token;
			const output = [];

			if (comment) {
				output.push(makeOutput({
					"valueCodeableConcept": {
						"text": comment
					}
				}));
			}

			if (status === "completed") {
				if (successQ1) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99999-1",
								display: "Was service available at convenient times?"
							},
							answer: {
								code: successQ1,
								display: LOINC_CODES_MAP[successQ1]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}

				if (successQ2) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99997-3",
								display: "Did the available food meet your immediate needs?"
							},
							answer: {
								code: successQ2,
								display: LOINC_CODES_MAP[successQ2]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}

				if (successQ3) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99996-4",
								display: "Was the available food ethnically appropriate?"
							},
							answer: {
								code: successQ3,
								display: LOINC_CODES_MAP[successQ3]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}
			}

			if (status === "failed" || status === "cancelled") {
				if (failedQ1) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99981-1",
								display: "Why did you cancel / not use the service?"
							},
							answer: {
								code: failedQ1,
								display: LOINC_CODES_MAP[failedQ1]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}

				if (failedQ2) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99982-2",
								display: "Do you want to reschedule the service?"
							},
							answer: {
								code: failedQ2,
								display: LOINC_CODES_MAP[failedQ2]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}

				if (failedQ2) {
					const observation = await client.create({
						resourceType: "Observation",
						body: makeOutputObservation({
							patientId: primaryPatient.id,
							serviceRequestId: referral.serviceRequest?.id,
							question: {
								code: "99983-3",
								display: "With the same organization?"
							},
							answer: {
								code: failedQ3,
								display: LOINC_CODES_MAP[failedQ3]
							}
						})
					});
					output.push(makeOutput({
						"valueReference": {
							"reference": `Observation/${observation.id}`
						}
					}));
				}
			}

			const newTask = await client.update({
				resourceType: "Task",
				id: referral.id as string,
				body: {
					...referral,
					status,
					output
				}
			});
			setTasks({
				...tasks,
				[referral.serverId]: tasks[referral.serverId].map(t => t.id === newTask.id ? newTask : t)
			});
		} catch (e) {
			console.log(e);
		} finally {
			setSubmitInProgress(false);
		}
	};

	if (isSubmitted) {
		return (
			<View>
				<Card>
					<Text
						color="#464953"
						fontSize="lg"
						fontWeight="medium"
						mb={5}
					>
						Outcome
					</Text>
					<View mb={4}>
						<Text
							color="#7B7F87"
							fontSize="sm"
						>
							Status:
						</Text>
						<Text
							color="#333333"
							fontSize="sm"
							textTransform="capitalize"
						>
							{ referral.status }
						</Text>
					</View>
					{
						outcomeObservations?.map((o, i) => (
							<View
								mb={4}
								key={i}
							>
								<Text
									color="#7B7F87"
									fontSize="sm"
								>
									{ o.question }
								</Text>
								<Text
									color="#333333"
									fontSize="sm"
								>
									{ o.answer }
								</Text>
							</View>
						))
					}
					{ referral.output?.[0].valueCodeableConcept?.text &&
						<View mb={4}>
							<Text
								color="#7B7F87"
								fontSize="sm"
							>
								Comment:
							</Text>
							<Text
								color="#333333"
								fontSize="sm"
							>
								{ referral.output?.[0].valueCodeableConcept?.text }
							</Text>
						</View>
					}
				</Card>
			</View>
		);
	}

	return (
		<View mb={10}>
			<Card>
				<Text
					color="#464953"
					fontSize="lg"
					fontWeight="medium"
					mb={5}
				>
					Outcome
				</Text>

				<FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Status:
						</Text>
					</FormControl.Label>
					<Select
						selectedValue={status}
						onValueChange={val => setStatus(val)}
						accessibilityLabel="Select status"
						placeholder="Select status"
						placeholderTextColor="#828282"
					>
						<Select.Item label="Completed" value="completed" />
						<Select.Item label="In Progress" value="in-progress" />
						<Select.Item label="Cancelled" value="cancelled" />
						<Select.Item label="Failed" value="failed" />
					</Select>
				</FormControl>

				{status === "completed" && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Was service available at convenient times?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99999-1"
						accessibilityLabel="Was service available at convenient times?"
						value={successQ1}
						onChange={val => setSuccessQ1(val)}
					>
						<Radio
							value="LA33-6"
							size="md"
							mr="20px"
						>
							Yes
						</Radio>
						<Radio
							value="LA32-8"
							size="md"
							mr="20px"
						>
							No
						</Radio>
					</Radio.Group>
				</FormControl> }

				{status === "completed" && successQ1 === "LA32-8" && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Did the available food meet your immediate needs?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99997-3"
						accessibilityLabel="Did the available food meet your immediate needs?"
						value={successQ2}
						onChange={val => setSuccessQ2(val)}
					>
						<Radio
							value="LA33-6"
							size="md"
							mr="20px"
						>
							Yes
						</Radio>
						<Radio
							value="LA32-8"
							size="md"
							mr="20px"
						>
							No
						</Radio>
					</Radio.Group>
				</FormControl> }

				{status === "completed" && successQ1 === "LA32-8" && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Was the available food ethnically appropriate?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99996-4"
						accessibilityLabel="Was the available food ethnically appropriate?"
						value={successQ3}
						onChange={val => setSuccessQ3(val)}
					>
						<Radio
							value="LA33-6"
							size="md"
							mr="20px"
						>
							Yes
						</Radio>
						<Radio
							value="LA32-8"
							size="md"
							mr="20px"
						>
							No
						</Radio>
						<Radio
							value="LA4489-6"
							size="md"
							mr="20px"
						>
							Unknown
						</Radio>
					</Radio.Group>
				</FormControl> }

				{(status === "cancelled" || status === "failed") && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Why did you cancel / not use the service?
						</Text>
					</FormControl.Label>
					<Radio.Group
						colorScheme="blue"
						name="99981-1"
						accessibilityLabel="Why did you cancel / not use the service?"
						value={failedQ1}
						onChange={val => setFailedQ1(val)}
					>
						<Radio
							value="LA991-1"
							size="md"
							mb="10px"
						>
							No longer needed
						</Radio>
						<Radio
							value="LA992-2"
							size="md"
							mb="10px"
						>
							Unwilling to use this type of service
						</Radio>
						<Radio
							value="LA993-3"
							size="md"
							mb="10px"
						>
							Unable to schedule appointment
						</Radio>
						<Radio
							value="LA994-4"
							size="md"
							mb="10px"
						>
							Unable to arrange transportation
						</Radio>
						<Radio
							value="LA995-5"
							size="md"
							mb="10px"
						>
							Do not feel safe using the organization
						</Radio>
						<Radio
							value="LA996-6"
							size="md"
							mb="10px"
							_text={{

							}}
						>
							Receive negative feedback on this organization
						</Radio>
						<Radio
							value="LA997-7"
							size="md"
							mb="10px"
						>
							Explain please
						</Radio>
					</Radio.Group>
				</FormControl> }

				{(status === "cancelled" || status === "failed") && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Do you want to reschedule the service?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99982-2"
						accessibilityLabel="Do you want to reschedule the service?"
						value={failedQ2}
						onChange={val => setFailedQ2(val)}
					>
						<Radio
							value="LA33-6"
							size="md"
							mr="20px"
						>
							Yes
						</Radio>
						<Radio
							value="LA32-8"
							size="md"
							mr="20px"
						>
							No
						</Radio>
					</Radio.Group>
				</FormControl> }

				{failedQ2 === "LA33-6" && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Would you use the service again?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99983-3"
						accessibilityLabel="Would you use the service again?"
						value={failedQ3}
						onChange={val => setFailedQ3(val)}
					>
						<Radio
							value="LA33-6"
							size="md"
							mr="20px"
						>
							Yes
						</Radio>
						<Radio
							value="LA32-8"
							size="md"
							mr="20px"
						>
							No
						</Radio>
					</Radio.Group>
				</FormControl> }

				{ status && <FormControl mb={5}>
					<FormControl.Label>
						<Text
							fontSize="sm"
							color="#7b7f87"
						>
							Comment:
						</Text>
					</FormControl.Label>
					<TextArea
						textAlignVertical="top"
						value={comment}
						onChangeText={text => setComment(text)}
						_focus={{ borderColor: "#0069ff" }}
						_hover={{ borderColor: "#0069ff" }}
						placeholder="Enter your comment here..."
						totalLines={3}
					/>
				</FormControl> }
			</Card>

			<HStack
				mt={5}
				mb={5}
				space={5}
				justifyContent="space-between"
			>
				<Button
					flex={1}
					variant="outline"
					onPress={() => console.log("save")}
					colorScheme="dark"
				>
					Save Outcomes
				</Button>
				<Button
					flex={1}
					onPress={() => handleSubmit()}
					colorScheme="blue"
					disabled={status === "in-progress"}
					isLoading={submitInProgress}
				>
					Submit Outcomes
				</Button>
			</HStack>
		</View>
	);
};

export default ReferralOutcome;
