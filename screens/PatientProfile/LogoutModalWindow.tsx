import React from "react";
import { HStack, Modal, View, Button } from "native-base";
import { useRecoilState } from "recoil";
import roleState from "../../recoil/roleState";

const LogoutModalWindow = (props: { isVisible: boolean, closeModal: (snowModal: boolean) => void} ) => {
	const [role, setRoleState] = useRecoilState(roleState);

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
						Log Out
					</Modal.Header>
					<Modal.Body>
						Are you sure you want to log out from the account?
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
									onPress={() => setRoleState(null)}
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
									Log out
								</Button>
							</View>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default LogoutModalWindow;
