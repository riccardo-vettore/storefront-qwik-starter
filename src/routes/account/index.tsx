import { $, component$, useBrowserVisibleTask$ } from '@builder.io/qwik';
import { scrollToTop } from '~/utils';
import { logout as logoutGql } from '~/providers/account/account';

export default component$(() => {
	useBrowserVisibleTask$(() => {
		scrollToTop();
	});

	const logout = $(async () => {
		await logoutGql();
		window.location.href = '/';
	});
	return (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back!</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="h-96 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
				<div class="text-xl text-gray-500 text-center">
					Account dashboard not done yet.
					<br />
					<a
						class="text-primary-600"
						target="_blank"
						href="https://github.com/vendure-ecommerce/storefront-qwik-starter"
					>
						Want to help?
					</a>
				</div>
			</div>
		</div>
	);
});
