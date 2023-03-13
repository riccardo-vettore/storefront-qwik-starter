import {
	$,
	component$,
	PropFunction,
	QwikChangeEvent,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { getActiveOrderQuery } from '~/graphql/queries';
import { isActiveCustomerValid, isShippingAddressValid } from '~/utils';
import { execute } from '~/utils/api';
import AddressForm from '../address-form/AddressForm';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelector from '../shipping-method-selector/ShippingMethodSelector';
import { CreateAddressInput, CreateCustomerInput } from '~/generated/graphql';

type IProps = {
	onForward$: PropFunction<
		(customer: CreateCustomerInput, shippingAddress: CreateAddressInput) => Promise<void>
	>;
};

export default component$<IProps>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const isFormValidSignal = useSignal(false);

	useBrowserVisibleTask$(async () => {
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		if (activeOrder?.customer) {
			appState.customer = activeOrder?.customer;
			if (activeOrder.shippingAddress) {
				appState.shippingAddress = activeOrder.shippingAddress;
			}
		}
	});

	useTask$(({ track }) => {
		track(() => appState.customer);
		track(() => appState.shippingAddress);
		isFormValidSignal.value =
			isShippingAddressValid(appState.shippingAddress) && isActiveCustomerValid(appState.customer);
	});

	return (
		<div>
			<div>
				<h2 class="text-lg font-medium text-gray-900">Contact information</h2>
				<form>
					<div class="mt-4">
						<label class="block text-sm font-medium text-gray-700">Email address</label>
						<div class="mt-1">
							<input
								type="email"
								value={appState.customer?.emailAddress}
								disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
								onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
									appState.customer = { ...appState.customer, emailAddress: event.target.value };
								})}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>
					<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">First name</label>
							<div class="mt-1">
								<input
									type="text"
									value={appState.customer?.firstName}
									disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										appState.customer = { ...appState.customer, firstName: event.target.value };
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">Last name</label>
							<div class="mt-1">
								<input
									type="text"
									value={appState.customer?.lastName}
									disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										appState.customer = { ...appState.customer, lastName: event.target.value };
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>
					</div>
				</form>
			</div>

			<input type="hidden" name="action" value="setCheckoutShipping" />
			<div class="mt-10 border-t border-gray-200 pt-10">
				<h2 class="text-lg font-medium text-gray-900">Shipping information</h2>
			</div>

			<AddressForm shippingAddress={appState.shippingAddress} />

			<div class="mt-10 border-t border-gray-200 pt-10">
				<ShippingMethodSelector />
			</div>

			<button
				class="bg-primary-600 hover:bg-primary-700 flex w-full items-center justify-center space-x-2 mt-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-300"
				onClick$={$(() => {
					if (isFormValidSignal.value) {
						onForward$(appState.customer, appState.shippingAddress);
					}
				})}
				disabled={!isFormValidSignal.value}
			>
				<LockClosedIcon />
				<span>Proceed to payment</span>
			</button>
		</div>
	);
});
