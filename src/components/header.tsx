import Link from 'next/link';
import Image from 'next/image';
import axios, { AxiosInstance, isAxiosError } from 'axios';
import createAxiosInstance from '../middlewares/axiosConfig';
import { UserProps } from '../types/user';
import { useEffect, useState } from 'react';
import FeLogo from '../public/images/FeLogo.png';
import defaultAvatar from '../public/images/default_avatar.png';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ThemeSwitcher from './switchTheme';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useRouter } from 'next/router';

export default function Header() {
	const router = useRouter();

	const [userData, setUserData] = useState<UserProps>();
	const [isNavbarOpen, setIsNabarOpen] = useState(false);

	useEffect(() => {
		const isUserConnected = Cookies.get('refreshToken');
		async function userData() {
			try {
				const axiosInstance: AxiosInstance = createAxiosInstance();
				const user = await axiosInstance.get('/users/me');
				setUserData(user.data.user);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					toast.error(error.response?.data, {
						pauseOnHover: false,
						pauseOnFocusLoss: false
					});
				}
			}
		}
		if (isUserConnected) {
			userData();
		}
	}, []);

	function handleLogout() {
		Cookies.remove('accessToken');
		Cookies.remove('refreshToken');
		localStorage.clear();
		router.push('/login');
	}

	function handleShowMenu() {
		setIsNabarOpen(prev => !prev);
	}

	return (
		<header className="header__container">
			<div className="header__logo">
				<Link href="/">
					<Image
						src="/images/FeLogo.png"
						width={50}
						height={50}
						alt="FuelEconomy Logo"
						priority
					></Image>
				</Link>
			</div>
			<div className={`header__content ${isNavbarOpen ? 'mobile' : ''}`}>
				<ul className="header__links">
					<li className="header__link" onClick={handleShowMenu}>
						<Link href="/">Station à proximité</Link>
					</li>
					{userData && (
						<li className="header__link" onClick={handleShowMenu}>
							<Link href="/user/me">Profil</Link>
						</li>
					)}
				</ul>
				<div className="header__profil">
					{userData ? (
						<>
							<Image
								src="/images/default_avatar.png"
								width={40}
								height={40}
								alt="Image de profil"
								priority
							></Image>
							{userData.username}
							<ThemeSwitcher />
							<div className="logout__container" onClick={handleLogout}>
								<div className="logout__card">
									<div className="logout__icon">
										<FaArrowRightFromBracket />
									</div>
								</div>
							</div>
						</>
					) : (
						<>
							<Link href="/login">Connexion</Link>
							<Link href="/register">Inscription</Link>
						</>
					)}
				</div>
			</div>
			<div className="hamburger__container">
				<div
					className={`hamburger ${isNavbarOpen ? 'active' : ''}`}
					onClick={handleShowMenu}
				>
					<svg viewBox="0 0 100 100">
						<path
							className="line line1"
							d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
						/>
						<path className="line line2" d="M 20,50 H 80" />
						<path
							className="line line3"
							d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
						/>
					</svg>
				</div>
			</div>
		</header>
	);
}
