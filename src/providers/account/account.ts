import { QueryOptions, sdk, WithHeaders } from '~/graphql-wrapper';
import gql from 'graphql-tag';
import { LoginMutation } from '~/generated/graphql';

export const login = async (
	email: string,
	password: string,
	rememberMe: boolean,
	options?: QueryOptions
): Promise<WithHeaders<LoginMutation['login']>> => {
	return sdk.login({ email, password, rememberMe }, options).then((res) => ({
		...res.login,
		_headers: res._headers,
	}));
};

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
