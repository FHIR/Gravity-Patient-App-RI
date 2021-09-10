import React, {useEffect, useState} from "react";
import {HStack, Modal, View, Button, Text} from "native-base";
import {useRecoilState} from "recoil";
import {Server, serversState} from "../../recoil/servers";
import {useNavigation} from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import coverageState from "../../recoil/coverage";
import focusState from "../../recoil/focus";
import ownerState from "../../recoil/owner";
import patientState from "../../recoil/patient";
import payorState from "../../recoil/payor";
import taskState from "../../recoil/task";

const DeleteServerModalWindow = (props: { server: Server, isVisible: boolean, closeModal: (snowModal: boolean) => void} ) => {
	const [currentServer, setCurrentServer] = useState();
	const [servers, setServers] = useRecoilState(serversState);
	const [coverages, setCoverageState] = useRecoilState(coverageState);
	const [focuses, setFocusesState] = useRecoilState(focusState);
	const [owners, setOwnersState] = useRecoilState(ownerState);
	const [patients, setPatientState] = useRecoilState(patientState);
	const [payors, setPayorsState] = useRecoilState(payorState);
	const [tasks, setTasksState] = useRecoilState(taskState);
	const navigation = useNavigation<RootStackParamList>();

	useEffect(() => {
		setCurrentServer(servers[props.server.id]);
	},[])

	const handleDeleteServer = () => {
		let serverToDeleteId = props.server.id;
		let { [serverToDeleteId]: server, ...restServers } = servers;
		let { [serverToDeleteId]: coverage, ...restCoverages } = coverages;
		let { [serverToDeleteId]: focus, ...restFocuses } = focuses;
		let { [serverToDeleteId]: owner, ...restOwners } = owners;
		let { [serverToDeleteId]: patient, ...restPatients } = patients;
		let { [serverToDeleteId]: payor, ...restPayors } = payors;
		let { [serverToDeleteId]: task, ...restTasks } = tasks;
		setServers(restServers);
		setCoverageState(restCoverages);
		setFocusesState(restFocuses);
		setOwnersState(restOwners);
		setPatientState(restPatients);
		setPayorsState(restPayors);
		setTasksState(restTasks);
		navigation.navigate("PatientProfile");
	}

	return (
		<>
			<Modal isOpen={props.isVisible} onClose={() => props.closeModal(false)}>
				<Modal.Content
					mb="auto"
					mt="20"
					pb="7"
					maxWidth={"100%"}
				>
					<Modal.Header
						_text={{
							fontSize: "2xl",
							fontWeight: "500",
						}}
					>
						Delete Server
					</Modal.Header>
					<Modal.Body>
						<Text>Are you sure you want to delete { props.server.title }?</Text>
					</Modal.Body>
					<Modal.Footer
						pr={7}
					>
						<HStack
							space={5}
							flex={1}
						>
							<View flex={1}>
								<Button
									bg="white"
									border={1}
									borderColor="#E7E7E7"
									_pressed={{
										backgroundColor: "#0069FF",
										_text: {
											color: "#fff"
										}}}
									_text={{
										color: "#333333",
										fontWeight: "400",
										fontSize: "sm",
									}}
									onPress={() => props.closeModal(false)}
								>
									Close
								</Button>
							</View>
							<View flex={1}>
								<Button
									onPress={() => handleDeleteServer()}
									bg={"#FF4D4D"}
									_pressed={{
										backgroundColor: "#0069FF",
										_text: {
											color: "#fff"
										}}}
									_text={{
										color: "white",
										fontWeight: "400",
										fontSize: "sm"
									}}
								>
									Delete
								</Button>
							</View>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default DeleteServerModalWindow;
