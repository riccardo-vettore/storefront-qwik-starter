import {
	$,
	Slot,
	component$,
	useContextProvider,
	useOn,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ImageTransformerProps, useImageProvider } from '~/components/image/Image';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID, IMAGE_RESOLUTIONS } from '~/constants';
import { ActiveCustomer, AppState } from '~/types';
import { scrollToTop } from '~/utils';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import { getCollections } from '~/providers/collections/collections';
import { Order } from '~/generated/graphql';
import { getActiveOrderQuery } from '~/providers/orders/order';
import { getAvailableCountriesQuery } from '~/providers/checkout/checkout';

export const useCollectionsLoader = routeLoader$(async () => {
	return await getCollections();
});

export const useAvailableCountriesLoader = routeLoader$(async () => {
	return await getAvailableCountriesQuery();
});

export default component$(() => {
	const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
		return `${src}?w=${width}&h=${height}&format=webp`;
	});

	// Provide your default options
	useImageProvider({
		imageTransformer$,
		resolutions: IMAGE_RESOLUTIONS,
	});

	const collectionsSignal = useCollectionsLoader();
	const availableCountriesSignal = useAvailableCountriesLoader();

	const state = useStore<AppState>({
		showCart: false,
		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' } as ActiveCustomer,
		activeOrder: {} as Order,
		collections: collectionsSignal.value || [],
		availableCountries: availableCountriesSignal.value || [],
		shippingAddress: {
			id: '',
			city: '',
			company: '',
			countryCode: availableCountriesSignal.value[0].code,
			fullName: '',
			phoneNumber: '',
			postalCode: '',
			province: '',
			streetLine1: '',
			streetLine2: '',
		},
		addressBook: [],
	});

	useContextProvider(APP_STATE, state);

	useVisibleTask$(async () => {
		scrollToTop();
		state.activeOrder = await getActiveOrderQuery();
	});

	useOn(
		'keydown',
		$((event: unknown) => {
			if ((event as KeyboardEvent).key === 'Escape') {
				state.showCart = false;
			}
		})
	);

	return (
		<div>
			<Header />
			<main>
				<Slot />
			</main>
			<Footer />
		</div>
	);
});
