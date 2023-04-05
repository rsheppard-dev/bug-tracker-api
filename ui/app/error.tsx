'use client';

type Props = {
	error: Error;
	reset: () => void;
};

export default function error({ error, reset }: Props) {
	return (
		<section className='container'>
			<h1 className='font-bold'>
				Oh no! Looks like you found a bug. Guess we need a bug tracker.
			</h1>
			<h2 className='text-xl'>{error.message || 'Something went wrong.'}</h2>
		</section>
	);
}
