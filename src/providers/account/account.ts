import { sdk } from '~/graphql-wrapper';
import gql from 'graphql-tag';
import {
	LoginMutation,
	LogoutMutation,
	RegisterCustomerAccountMutation,
	RegisterCustomerAccountMutationVariables,
	UpdateCustomerInput,
	VerifyCustomerAccountMutation,
} from '~/generated/graphql';

export const login = async (
	email: string,
	password: string,
	rememberMe: boolean
): Promise<LoginMutation['login']> => {
	return sdk.login({ email, password, rememberMe }).then((res) => ({ ...res.login }));
};

export const logout = async (): Promise<LogoutMutation['logout']> => {
	return sdk.logout().then((res) => ({ ...res.logout }));
};

export const registerCustomerAccount = async (
	variables: RegisterCustomerAccountMutationVariables
): Promise<RegisterCustomerAccountMutation['registerCustomerAccount']> => {
	return sdk.registerCustomerAccount(variables).then((res) => ({ ...res.registerCustomerAccount }));
};

export const verifyCustomerAccount = async (
	token: string,
	password?: string
): Promise<VerifyCustomerAccountMutation['verifyCustomerAccount']> => {
	return sdk
		.verifyCustomerAccount({ token, password })
		.then((res) => ({ ...res.verifyCustomerAccount }));
};

export async function updateCustomer(input: UpdateCustomerInput) {
	return sdk.updateCustomer({ input });
}

export async function requestUpdateCustomerEmailAddress(password: string, newEmailAddress: string) {
	return sdk
		.requestUpdateCustomerEmailAddress({ password, newEmailAddress })
		.then((res) => res.requestUpdateCustomerEmailAddress);
}

export async function updateCustomerEmailAddress(token: string) {
	return sdk.updateCustomerEmailAddress({ token }).then((res) => res.updateCustomerEmailAddress);
}

gql`
	mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
		login(username: $email, password: $password, rememberMe: $rememberMe) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation logout {
		logout {
			success
		}
	}
`;

gql`
	mutation registerCustomerAccount($input: RegisterCustomerInput!) {
		registerCustomerAccount(input: $input) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation verifyCustomerAccount($token: String!, $password: String) {
		verifyCustomerAccount(token: $token, password: $password) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation updateCustomer($input: UpdateCustomerInput!) {
		updateCustomer(input: $input) {
			__typename
		}
	}
`;

gql`
	mutation requestUpdateCustomerEmailAddress($password: String!, $newEmailAddress: String!) {
		requestUpdateCustomerEmailAddress(password: $password, newEmailAddress: $newEmailAddress) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation updateCustomerEmailAddress($token: String!) {
		updateCustomerEmailAddress(token: $token) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
