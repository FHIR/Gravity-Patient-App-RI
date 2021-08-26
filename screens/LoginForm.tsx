import React from "react";
import { Icon, Button, VStack, FormControl, Image, Heading, Text, Input, Checkbox, KeyboardAvoidingView } from "native-base";
import { Path, Line } from "react-native-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Caregiver, Patient } from "../utils/constants";

const LoginForm = ({ navigation }: NativeStackScreenProps<RootStackParamList, "LoginForm">): JSX.Element => {
	type IformData = {
		name: string,
		password: string
	};

	const [showPassword, setShowPassword] = React.useState(false);
	const [formData, setData] = React.useState<IformData>({ name: "", password: "" });
	const [errors, setErrors] = React.useState({});
	const [checkboxValue, setCheckboxValue] = React.useState(false);

	const storeRole = async (value: string) => {
		try {
			await AsyncStorage.setItem("@role", value);
		} catch (e) {
			console.log("Saving Error");
		}
	};

	const validate = () => {
		if (formData.name === Caregiver.role && formData.password === Caregiver.password) {
			storeRole("Caregiver");

			return true;
		}

		if (formData.name === Patient.role && formData.password === Patient.password) {
			storeRole("Patient");

			return true;
		}

		setErrors({
			...errors,
			name: "Name or password is incorrect"
		});

		return false;
	};

	const toggleShowPassword = () => setShowPassword(!showPassword);

	const onSubmit = () => {
		validate() ? console.log("Logged") : console.log("Validation Failed");
	};

	return (
		<KeyboardAvoidingView
			bg="white"
			flex={1}
			flexDirection="column"
			justifyContent="center"
			behavior="position"
			keyboardVerticalOffset={-77}
		>
			<Image
				width="126px"
				height="83px"
				alignSelf="center"
				alt="logo"
				source={require("../assets/images/gravity-logo.jpg")}
			/>
			<VStack space={3} pl={5} pr={5}>
				<Heading
					fontSize="2xl"
					fontWeight="500"
					mt="37px"
				>
					Welcome to Your Health App
				</Heading>
				<Text color="#333333">Login into the app</Text>
				<FormControl isRequired isInvalid={"name" in errors}>
					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="xs"
								color="#7b7f87"
								marginTop="10"
							>
								Username
							</Text>
						</FormControl.Label>
						<Input
							onChangeText={ value => setData({ ...formData, name: value })}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							isFullWidth={true}
						/>
					</FormControl>
					<FormControl>
						<FormControl.Label>
							<Text
								fontSize="xs"
								color="#7b7f87"
								marginTop="10"
						>
								Password
							</Text>
						</FormControl.Label>
						<Input
							onChangeText={ value => setData({ ...formData, password: value })}
							isFullWidth={true}
							type={showPassword ? "text" : "password"}
							_focus={{ borderColor: "#0069ff" }}
							_hover={{ borderColor: "#0069ff" }}
							InputRightElement={
								<Button variant="unstyled" padding="0" onPress={toggleShowPassword}>
									{ showPassword ?
										<Icon mt="2px" width="42" height="42" viewBox="0 0 42 42" fill="none">
											<Path d="M31.8666 19.6056C31.679 19.3578 27.2089 14 21.4999 14C15.7909 14 11.3207 19.3578 11.1333 19.6054C10.9556 19.8405 10.9556 20.1593 11.1333 20.3944C11.3207 20.6422 15.7909 26 21.4999 26C27.2089 26 31.679 20.6421 31.8666 20.3946C32.0445 20.1595 32.0445 19.8405 31.8666 19.6056ZM21.4999 25.1247C17.2946 25.1247 13.6524 21.2622 12.5742 19.9995C13.651 18.7357 17.2856 15.3846 21.4999 15.3846C25.705 15.3846 29.347 18.7371 30.4256 20.0005C29.3488 21.2642 25.7142 25.1247 21.4999 25.1247Z" fill="#0069FF"/>
											<Path d="M21.5 15C18.4674 15 16 17.2431 16 20C16 22.7569 18.4674 25 21.5 25C24.5326 25 27 22.7569 27 20C27 17.2431 24.5326 15 21.5 15ZM21.5 23.3333C19.4781 23.3333 17.8334 21.838 17.8334 20C17.8334 18.162 19.4782 16.6667 21.5 16.6667C23.5218 16.6667 25.1666 18.162 25.1666 20C25.1666 21.838 23.5219 23.3333 21.5 23.3333Z" fill="#0069FF"/>
										</Icon> :
										<Icon width="42" height="42" viewBox="0 0 42 42" fill="none">
											<Line x1="12.3254" y1="13.6204" x2="29.3631" y2="28.2241" stroke="#0069FF"/>
											<Path d="M31.8666 20.6056C31.679 20.3578 27.2089 15 21.4999 15C15.7909 15 11.3207 20.3578 11.1333 20.6054C10.9556 20.8405 10.9556 21.1593 11.1333 21.3944C11.3207 21.6422 15.7909 27 21.4999 27C27.2089 27 31.679 21.6421 31.8666 21.3946C32.0445 21.1595 32.0445 20.8405 31.8666 20.6056ZM21.4999 26.1247C17.2946 26.1247 13.6524 22.2622 12.5742 20.9995C13.651 19.7357 17.2856 16.3846 21.4999 16.3846C25.705 16.3846 29.347 19.7371 30.4256 21.0005C29.3488 22.2642 25.7142 26.1247 21.4999 26.1247Z" fill="#0069FF"/>
											<Path d="M21.5 16C18.4674 16 16 18.2431 16 21C16 23.7569 18.4674 26 21.5 26C24.5326 26 27 23.7569 27 21C27 18.2431 24.5326 16 21.5 16ZM21.5 24.3333C19.4781 24.3333 17.8334 22.838 17.8334 21C17.8334 19.162 19.4782 17.6667 21.5 17.6667C23.5218 17.6667 25.1666 19.162 25.1666 21C25.1666 22.838 23.5219 24.3333 21.5 24.3333Z" fill="#0069FF"/>
										</Icon>
									}
								</Button>
							}
						/></FormControl>
					<FormControl.ErrorMessage _text={{ fontSize: "xs", color: "error.500", fontWeight: 500 }}>{ errors.name }</FormControl.ErrorMessage>
				</FormControl>
				<Checkbox
					onChange={ () => setCheckboxValue(!checkboxValue)}
					ml={3}
					mr={2}
					w={"90%"}
					colorScheme="blue"
					accessibilityLabel="I agree with terms and conditions for using this app"
					size="md"
					value="two"> <Text color="grey">I agree with terms and conditions for using this app</Text>
				</Checkbox>
				<Button
					isDisabled={formData.name.length <= 0 ||
					formData.password.length <= 0 ||
					!checkboxValue}
					onPress={ onSubmit }
					mt="60px"
					colorScheme="blue"
					w={"100%"}
				>
					Login
				</Button>
			</VStack>
		</KeyboardAvoidingView>
	);};
export default LoginForm;
