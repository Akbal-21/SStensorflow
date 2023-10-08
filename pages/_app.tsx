// import '@/styles/globals.css'
import type { AppProps } from "next/app";
import "reflect-metadata";
import { SWRConfig } from "swr";
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{
				fetcher: (resource, init) =>
					fetch(resource, init).then((res) => res.json()),
			}}
		>
			<Component {...pageProps} />
			<Analytics/>
		</SWRConfig>
	);
}
