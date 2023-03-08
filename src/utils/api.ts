import { server$ } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import { AUTH_TOKEN, HEADER_AUTH_TOKEN_KEY } from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { getCookie, setCookie } from '.';
import { DocumentNode, print } from 'graphql';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps = { query: string; variables: Record<string, any> };
type Options = { method: string; headers: Record<string, string>; body: string };

export interface GraphqlResponse<Response> {
	errors: any[];
	data: Response;
}

export const requester = async <R, V>(
	doc: DocumentNode,
	vars?: V
	/*	options?: { headers?: Headers; request?: Request }*/
): Promise<R> => {
	return execute<R, V>({ query: print(doc), variables: vars });
	/*.then( async (response) => {
    return { ...response.data }
  })*/
};

export const execute = async <R, V>(body: {
	query: string;
	variables?: V;
}): Promise<GraphqlResponse<> & { headers: Headers }> => {
	const headers = createHeaders();
	const options = { method: 'POST', headers, body: JSON.stringify(body) };

	const response: ResponseProps<R> = isBrowser
		? await executeOnTheServer(options)
		: await executeRequest(options);

	if (isBrowser && response.token) {
		setCookie(AUTH_TOKEN, response.token, 365);
	}

	return { data: response.data, headers };
};

const createHeaders = () => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		headers = { ...headers, Authorization: `Bearer ${token}` };
	}
	return headers;
};

const executeOnTheServer = server$((options: Options) => executeRequest(options));

//const executeRequest = async <Response>(options: Options): Promise<ResponseProps<Response>> => {
const executeRequest = async (options: Options) => {
	const httpResponse = await fetch(ENV_VARIABLES.VITE_VENDURE_PUBLIC_URL, options);
	return await extractTokenAndData(httpResponse);
};

const extractTokenAndData = async (response: Response) => {
	const token = response.headers.get(HEADER_AUTH_TOKEN_KEY) || '';
	const { data } = await response.json();
	return { token, data };
};
