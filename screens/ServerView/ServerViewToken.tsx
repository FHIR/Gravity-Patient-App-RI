import React from "react";
import { Box, Text, View, HStack, Button } from "native-base";

const ServerViewToken = ():JSX.Element => (
	<View>
		<Text color="#7B7F87" fontSize={14} mb={3} fontWeight={400}>Your access to the server will expire in:</Text>
		<HStack justifyContent="space-between" mb={3}>
			<Box justifyContent="center" alignItems="center">
				<Text fontSize={20} fontWeight="400">1</Text>
				<Text fontSize={10} fontWeight="400" color="#7B7F87">Month</Text>
			</Box>
			<Box justifyContent="center" alignItems="center">
				<Text fontSize={20} fontWeight="400">2</Text>
				<Text fontSize={10} fontWeight="400" color="#7B7F87">Days</Text>
			</Box>
			<Box justifyContent="center" alignItems="center">
				<Text fontSize={20} fontWeight="400">3</Text>
				<Text fontSize={10} fontWeight="400" color="#7B7F87">Hours</Text>
			</Box>
			<Box justifyContent="center" alignItems="center">
				<Text fontSize={20} fontWeight="400">4</Text>
				<Text fontSize={10} fontWeight="400" color="#7B7F87">Minutes</Text>
			</Box>
			<Button bg="#0069FF">Renew</Button>
		</HStack>
	</View>
);

export default ServerViewToken;
