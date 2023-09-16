import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, ComponentType } from 'react';

type WithAuthProps<P> = {
	WrappedComponent: ComponentType<P>;
};

const withAuth = <P extends object>({ WrappedComponent }: WithAuthProps<P>) => {
	return (props: P) => {
		const accessToken = Cookies.get('access-token');
		const router = useRouter();

		useEffect(() => {
			if (!accessToken) {
				router.push('/login');
			}
		}, [accessToken]);

		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
