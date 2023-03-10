import { getSdk } from '~/generated/graphql';
import { requester } from '~/utils/api';

const baseSdk = getSdk<QueryOptions>(requester);

export interface QueryOptions {
	request: Request;
}

type Sdk = typeof baseSdk;
type SdkWithHeaders = {
	[k in keyof Sdk]: (
		...args: Parameters<Sdk[k]>
	) => Promise<Awaited<ReturnType<Sdk[k]>> & { _headers: Headers }>;
};

export const sdk: SdkWithHeaders = baseSdk as any;

export type WithHeaders<T> = T & { _headers: Headers };
