import { getSdk } from '~/generated/graphql';
import { requester } from '~/utils/api-test';

export const sdk = getSdk(requester);
