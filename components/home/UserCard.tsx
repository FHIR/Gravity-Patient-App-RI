import React from "react";
import { Avatar, HStack, Text, VStack } from "native-base";
import Card from "../Card";

const UserCard = ():JSX.Element => {
	return (
		<Card>
			<HStack alignItems="center">
				<Avatar size="55px">User</Avatar>
				<VStack ml={4}>
					<Text
						color="#333"
						fontSize="lg"
					>
						Rebecca Smith
					</Text>
					<Text
						color="#7b7f87"
						fontSize="sm"
					>
						rebecca.smith@mail.com
					</Text>
				</VStack>
			</HStack>
		</Card>
	);
};

export default UserCard;
