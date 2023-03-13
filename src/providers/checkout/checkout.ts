import { sdk } from '~/graphql-wrapper';
import gql from 'graphql-tag';
import { PaymentInput } from '~/generated/graphql';

export const getAvailableCountries = () => {
	return sdk.availableCountries({});
};

export const transitionOrderToState = (state = 'ArrangingPayment') => {
	return sdk.transitionOrderToState({ state });
};

export const addPaymentToOrderMutation = (input = { method: 'standard-payment', metadata: {} }) => {
	return addPaymentToOrder(input);
};

export const addPaymentToOrder = (input: PaymentInput) => {
	return sdk.addPaymentToOrder({ input });
};

gql`
	query availableCountries {
		availableCountries {
			id
			name
			code
		}
	}
`;

gql`
	mutation transitionOrderToState($state: String!) {
		transitionOrderToState(state: $state) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation addPaymentToOrder($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
