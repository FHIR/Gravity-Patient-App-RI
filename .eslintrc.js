module.exports = {
	"root": true,
	"parser": "@typescript-eslint/parser",
	"env": {
		"node": true
	},
	"plugins": [
		"@typescript-eslint"
	],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended"
	],
	"rules": {
		"semi": ["error", "always"],
		"curly": "error",
		"quotes": ["warn", "double"],
		"dot-notation": "error",
		"no-cond-assign": "warn",
		"no-nested-ternary": "warn",
		"arrow-body-style": ["error", "as-needed"],
		"arrow-parens": ["error", "as-needed"],
		"prefer-arrow-callback": "warn",
		"no-debugger": "warn",
		"no-extra-bind": "error",
		"no-fallthrough": "off",
		"no-use-before-define": "off",
		"prefer-const": ["warn", {
			"ignoreReadBeforeAssign": true
		}],
		"no-var": "error",
		"no-shadow-restricted-names": "error",
		"no-undef": "error",
		"no-unused-vars": "warn",
		"no-console": "off",
		"no-irregular-whitespace": "warn",
		"comma-dangle": ["warn", "never"],
		"func-call-spacing": ["error", "never"],
		"no-trailing-spaces": "error",
		"no-unneeded-ternary": "warn",
		"object-property-newline": ["warn", {
			"allowMultiplePropertiesPerLine": true
		}],
		"one-var-declaration-per-line": ["error", "initializations"],
		"constructor-super": "warn",
		"no-dupe-class-members": "error",
		"no-duplicate-imports": "error",
		"no-useless-constructor": "warn",
		"object-shorthand": ["warn", "properties"],
		"prefer-destructuring": "warn",
		"prefer-template": "error",
		"object-curly-spacing": ["error", "always"],
		"camelcase": ["error", {
			"allow": ["^\\$_"]
		}],
		"indent": ["warn", "tab", {
			"SwitchCase": 1
		}],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": [
			"warn", {
				"additionalHooks": "useRecoilCallback|useRecoilTransaction_UNSTABLE"
			}
		]
	},
	"overrides": [
		{
			"files": ["*.tsx", "*.ts"],
			"rules": {
				"no-undef": "off"
			}
		}
	]
};
