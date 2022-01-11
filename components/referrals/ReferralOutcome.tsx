import { FormControl, HStack, Select, Text, TextArea, View, Button, Radio, Input } from "native-base";
import React, { useState, useEffect } from "react";
import Card from "../Card";
import { useRecoilState } from "recoil";
import { useWithAccessToken } from "../../recoil/servers";
import Client from "fhir-kit-client";
import { QuestionnaireResponse, Task, TaskOutput, Annotation } from "fhir/r4";
import taskState from "../../recoil/task";
import { questRespState } from "../../recoil/questResp";
import { filterMap } from "../../utils/";

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

type AnswerItem = {
	linkId: string,
	text?: string,
	answer?: {
		valueCoding?: {
			system?: string,
			code: string,
			display: string
		},
		valueString?: string
	}[]
}

const createQuestionnaireResponse = (patientId: string, patientName: string,  answers: AnswerItem[]) => ({
	resourceType: "QuestionnaireResponse",
	"status" : "completed",
	"subject" : {
		"reference": `Patient/${patientId}`,
		"display": patientName
	},
	"authored" : new Date().toISOString(),
	"source" : {
		"reference": `Patient/${patientId}`,
		"display": patientName
	},
	item: answers
});

const ReferralOutcome = ({ referral }: { referral: Task }): JSX.Element => {
	const [status, setStatus] = useState<string>("");
	const [comment, setComment] = useState<string>("");
	const [successQ1, setSuccessQ1] = useState<string>("");
	const [successQ2, setSuccessQ2] = useState<string>("");
	const [successQ3, setSuccessQ3] = useState<string>("");
	const [failedQ1, setFailedQ1] = useState<string>("");
	const [failedQ1Explain, setFailedQ1Explain] = useState<string>("");
	const [failedQ2, setFailedQ2] = useState<string>("");
	const [failedQ3, setFailedQ3] = useState<string>("");

	const withAccessToken = useWithAccessToken();

	const [tasks, setTasks] = useRecoilState(taskState);
	const [questResps, setQuestResps] = useRecoilState(questRespState);
	const isSubmitted = ["rejected", "cancelled", "on-hold", "failed", "completed", "entered-in-error"].includes(referral.status);
	const [submitInProgress, setSubmitInProgress] = useState(false);
	const [response, setResponse] = useState<{ question: string | undefined, answer: string | undefined }[] | undefined>(undefined);

	useEffect(() => {
		const fetchObservation = async () => {
			const [responseId] = filterMap(referral.output || [], out => out.valueReference?.reference?.match(/^QuestionnaireResponse\/(?<id>.+)/)?.groups?.id);
			const response = responseId ? questResps[referral.serverId]?.find(resp => resp.id === responseId) : undefined;

			const questAnswer = response?.item?.map(item => ({
				question: item.text,
				answer: item.answer?.[0].valueCoding?.display ||  item.answer?.[0].valueString
			}));


			setResponse(questAnswer);
		};

		if (isSubmitted) {
			fetchObservation();
		}
	}, [isSubmitted]);


	useEffect(() => {
		setComment("");
	}, [status]);

	const handleSubmit = async () => {
		try {
			setSubmitInProgress(true);

			const answerItems: AnswerItem[] = [];
			let commentItem: Annotation | undefined = undefined;
			if (comment) {
				commentItem = {
					"text": comment,
					"time": new Date().toISOString(),
					"authorReference": {
						"display": referral.for?.display,
						"reference": `Patient/${referral.for?.reference?.split("/")[1]}`
					}
				};
			}

			if (status === "completed") {
				if (successQ1) {
					answerItems.push({
						"linkId": "/88122-7",
						"text": "Was service available at convenient times?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": successQ1,
									"display": LOINC_CODES_MAP[successQ1]
								}
							}
						]
					});
				}

				if (successQ2) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Did the available food meet your immediate needs?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": successQ2,
									"display": LOINC_CODES_MAP[successQ2]
								}
							}
						]
					});
				}

				if (successQ3) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Was the available food ethnically appropriate?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": successQ3,
									"display": LOINC_CODES_MAP[successQ3]
								}
							}
						]
					});
				}
			}

			if (status === "failed" || status === "cancelled") {
				if (failedQ1Explain) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Why did you cancel / not use the service?",
						"answer": [
							{
								"valueString": failedQ1Explain
							}
						]
					});
				} else if (failedQ1) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Why did you cancel / not use the service?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": failedQ1,
									"display": LOINC_CODES_MAP[failedQ1]
								}
							}
						]
					});
				}

				if (failedQ2) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Did the service meet your needs?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": failedQ2,
									"display": LOINC_CODES_MAP[failedQ2]
								}
							}
						]
					});
				}

				if (failedQ3) {
					answerItems.push({
						"linkId": "/88124-3",
						"text": "Would you use the service again?",
						"answer": [
							{
								"valueCoding": {
									"system": "http://loinc.org",
									"code": failedQ3,
									"display": LOINC_CODES_MAP[failedQ3]
								}
							}
						]
					});
				}
			}

			withAccessToken(referral.serverId, async (token, patientId, fhirUri) => {
				const client = new Client( { baseUrl: fhirUri });
				client.bearerToken = token;
				const result = await client.create({
					resourceType: "QuestionnaireResponse",
					body: createQuestionnaireResponse(patientId, referral.for?.display, answerItems)
				}) as QuestionnaireResponse;

				setQuestResps(old => ({
					...old,
					[referral.serverId]: [...(old[referral.serverId] || []), result]
				}));

				const output: TaskOutput = {
					type: {
						coding: [{
							"system": "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
							"code": "questionnaire-response",
							"display": "Questionnaire Response"
						}]
					},
					valueReference: {
						reference: `QuestionnaireResponse/${result.id}`
					}
				};

				const prepareNewTask = !commentItem ?{
					...referral,
					status,
					output
				} : {
					...referral,
					status,
					output,
					note: referral.note ? [...referral.note, commentItem] : [commentItem]
				};

				const newTask = await client.update({
					resourceType: "Task",
					id: referral.id as string,
					body: prepareNewTask
				}) as Task;

				setTasks(old => ({
					...old,
					[referral.serverId]: tasks[referral.serverId].map(t => t.id === newTask.id ? newTask : t)
				}));
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
						Status / Outcome
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
						response?.map((item, i) => (
							<View
								mb={4}
								key={i}
							>
								<Text
									color="#7B7F87"
									fontSize="sm"
								>
									{ item.question }
								</Text>
								<Text
									color="#333333"
									fontSize="sm"
								>
									{ item.answer }
								</Text>
							</View>
						))
					}
					{ referral.note?.length &&
						<View mb={4}>
							<Text
								color="#7B7F87"
								fontSize="sm"
							>
								Comment:
							</Text>
							{ referral.note?.map((comment, i) => (
								<Text
									key={i}
									color="#333333"
									fontSize="sm"
								>
									{comment.text}
								</Text>
							)) }
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
					Status / Outcome
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
							Did the service meet your needs?
						</Text>
					</FormControl.Label>
					<Radio.Group
						flexDirection="row"
						colorScheme="blue"
						name="99999-1"
						accessibilityLabel="Did the service meet your needs?"
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
							_text={{
								flexShrink: 1
							}}
						>
							No longer needed
						</Radio>
						<Radio
							value="LA992-2"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Unwilling to use this type of service
						</Radio>
						<Radio
							value="LA993-3"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Unable to schedule appointment
						</Radio>
						<Radio
							value="LA994-4"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Unable to arrange transportation
						</Radio>
						<Radio
							value="LA995-5"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Do not feel safe using the organization
						</Radio>
						<Radio
							value="LA996-6"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Receive negative feedback on this organization
						</Radio>
						<Radio
							value="LA997-7"
							size="md"
							mb="10px"
							_text={{
								flexShrink: 1
							}}
						>
							Explain
							<Input
								w="70%"
								ml="10px"
								size="sm"
								px="10px"
								py="5px"
								value={failedQ1Explain}
								onChangeText={val => setFailedQ1Explain(val)}
								placeholder="Explain please"
								_focus={{ borderColor: "#0069ff" }}
								_hover={{ borderColor: "#0069ff" }}
							/>
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
				{/*<Button*/}
				{/*	flex={1}*/}
				{/*	variant="outline"*/}
				{/*	onPress={() => console.log("save")}*/}
				{/*	colorScheme="dark"*/}
				{/*>*/}
				{/*	Save Outcomes*/}
				{/*</Button>*/}
				<Button
					flex={1}
					onPress={() => handleSubmit()}
					colorScheme="blue"
					disabled={!status}
					isLoading={submitInProgress}
				>
					Submit
				</Button>
			</HStack>
		</View>
	);
};

export default ReferralOutcome;
