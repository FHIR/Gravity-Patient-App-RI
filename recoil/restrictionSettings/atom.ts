import { atom } from "recoil";

const restrictionSettings = atom({
	key: "restrictionSettings",
	default: {
		settings: [
			{ value: "Intimate Partner Violence", checked: true },
			{ value: "Social Isolation", checked: true },
			{ value: "Food Insecurity", checked: true },
			{ value: "Housing Instability", checked: false },
			{ value: "Homelessness", checked: false },
			{ value: "Inadequate Housing", checked: false },
			{ value: "Transportation Insecurity", checked: false },
			{ value: "Financial Insecurity", checked: false },
			{ value: "Material Hardship", checked: false },
			{ value: "Educational Attainment", checked: false },
			{ value: "Employment Status", checked: false },
			{ value: "Veteran Status", checked: false },
			{ value: "Stress", checked: false }
		],
		hidden: false
	}
});

export default restrictionSettings;
