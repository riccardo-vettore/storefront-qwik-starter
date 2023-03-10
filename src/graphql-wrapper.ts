import { getSdk } from '~/generated/graphql';
import { requester } from '~/utils/api-test';

export const sdk = getSdk(requester);

/*export interface QueryOptions {
	request: Request;
}

type Sdk = typeof baseSdk;
type SdkWithHeaders = {
	[k in keyof Sdk]: (
		...args: Parameters<Sdk[k]>
	) => Promise<Awaited<ReturnType<Sdk[k]>> & { _headers: Headers }>;
};*/
