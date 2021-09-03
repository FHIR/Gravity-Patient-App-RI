import React from "react";
import { HStack, Icon, Text, VStack } from "native-base";
import { Path } from "react-native-svg";
import Card from "../Card";
import { useRecoilValue } from "recoil";
import { ownerClinicalStaff } from "../../recoil/owner";


const ClinicalStaffCard = ():JSX.Element => {
	const [primaryStaff] = useRecoilValue(ownerClinicalStaff);

	return (
		<Card>
			<HStack
				space={1}
				alignItems="center"
				mb={4}
			>
				<Icon
					size={5}
					viewBox="0 0 20 20"
					fill="none"
				>
					<Path
						d="M6.66667 3V4.36842H5.33333V7.10526C5.33333 8.61737 6.52667 9.84211 8 9.84211C9.47333 9.84211 10.6667 8.61737 10.6667 7.10526V4.36842H9.33333V3H11.3333C11.7013 3 12 3.30653 12 3.68421V7.10526C12 9.13942 10.5587 10.8274 8.66667 11.1537V12.2368C8.66667 13.5594 9.71133 14.6316 11 14.6316C11.998 14.6316 12.85 13.9884 13.1833 13.0832C12.4853 12.7637 12 12.0453 12 11.2105C12 10.0768 12.8953 9.1579 14 9.1579C15.1047 9.1579 16 10.0768 16 11.2105C16 12.1486 15.3867 12.9395 14.5493 13.1845C14.14 14.804 12.706 16 11 16C8.97467 16 7.33333 14.3155 7.33333 12.2368V11.1537C5.44133 10.8281 4 9.13942 4 7.10526V3.68421C4 3.30653 4.29867 3 4.66667 3H6.66667ZM14 10.5263C13.632 10.5263 13.3333 10.8328 13.3333 11.2105C13.3333 11.5882 13.632 11.8947 14 11.8947C14.368 11.8947 14.6667 11.5882 14.6667 11.2105C14.6667 10.8328 14.368 10.5263 14 10.5263Z"
						fill="#BECDFF"
					/>
				</Icon>
				<Text
					fontSize="xs"
					fontWeight="medium"
					ml={1}
				>
					Clinical Staff
				</Text>
			</HStack>
			<VStack>
				{ primaryStaff ?
					<>
						<Text
							fontSize="xxs"
							color="#7B7F87"
						>
							Primary
						</Text>
						<Text fontSize="md">{ primaryStaff.name }</Text>
					</>
					:
					<Text fontSize="md">N/A</Text>
				}
			</VStack>
		</Card>
	);
};

export default ClinicalStaffCard;
