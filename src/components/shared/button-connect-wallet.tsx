// import { useAccount, useDisconnect } from "wagmi";
// import { useCallback, useEffect, useRef } from "react";
// import { UserRound } from "lucide-react";
// // import {
// // 	useDynamicContext,
// // 	DynamicConnectButton,
// // } from "@dynamic-labs/sdk-react-core";
// import { metis } from "wagmi/chains";

// import IconCopyGradient from "@/assets/icons/copy-gradient.svg?react";
// import IconWallet from "@/assets/icons/wallet.svg?react";
// import IconLogout from "@/assets/icons/logout.svg?react";
// import IconChevronDown from "@/assets/icons/chevron-down.svg?react";
// import { Button, buttonVariants } from "@/components/ui/button";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
// 	useUserControllerFindOne,
// 	useUserControllerCreate,
// 	useReferralControllerRegister,
// } from "@/services/queries";
// import { cn, shortenAddress } from "@/lib/utils";
// import { useCopyToClipboard } from "@/hooks/utils/use-copy-to-clipboard";
// import { getReferralAddress, clearReferralAddress } from "@/lib/referral";
// import { Link } from "@tanstack/react-router";

// export const ConnectWalletButton = () => {
// 	const { address, chain } = useAccount();
// 	// const { handleLogOut, primaryWallet } = useDynamicContext();
// 	const { copyToClipboard } = useCopyToClipboard();
// 	const { disconnect } = useDisconnect();
// 	const isRegisteredRef = useRef(false);
// 	const maxRetries = 3;
// 	const retryCountRef = useRef(0);

// 	const { data: userInfo, isFetching: isFetchingUser } =
// 		useUserControllerFindOne(address!, {
// 			query: { enabled: !!address },
// 		});

// 	const createUser = useUserControllerCreate();
// 	const registerReferral = useReferralControllerRegister();

// 	const registerUser = useCallback(async () => {
// 		if (userInfo || !address || isRegisteredRef.current || isFetchingUser)
// 			return;

// 		if (createUser.isPending || registerReferral.isPending) return;
// 		if (retryCountRef.current >= maxRetries) {
// 			console.error("Max registration attempts reached");
// 			return;
// 		}

// 		try {
// 			// First register the user
// 			await createUser.mutateAsync();

// 			// Check for referral address
// 			const referralAddress = getReferralAddress();
// 			if (
// 				referralAddress &&
// 				referralAddress.toLowerCase() !== address.toLowerCase()
// 			) {
// 				await registerReferral.mutateAsync({
// 					data: {
// 						referralAddress: referralAddress,
// 					},
// 				});
// 			}

// 			// Clear stored referral after successful registration
// 			clearReferralAddress();
// 			isRegisteredRef.current = true;
// 			retryCountRef.current = 0; // Reset counter on success
// 		} catch (error) {
// 			console.error("Failed to register user or referral:", error);
// 			retryCountRef.current += 1;
// 			if (retryCountRef.current < maxRetries) {
// 				// Retry after a short delay
// 				setTimeout(registerUser, 1000);
// 			}
// 		}
// 	}, [userInfo, address, createUser, registerReferral, isFetchingUser]);

// 	useEffect(() => {
// 		registerUser();
// 	}, [registerUser]);

// 	useEffect(() => {
// 		const storageAddress = localStorage.getItem("wallet-address");
// 		if (address && storageAddress !== address) {
// 			localStorage.setItem("wallet-address", address);
// 		}
// 	}, [address]);

// 	// useEffect(() => {
// 	// 	if (address && chain?.id !== metis.id && primaryWallet) {
// 	// 		primaryWallet?.switchNetwork(metis.id);
// 	// 	}
// 	// }, [address, chain?.id, primaryWallet]);

// 	if (!address)
// 		return (
// 			// <DynamicConnectButton buttonContainerClassName="w-fit">
// 			// 	<div
// 			// 		className={cn(
// 			// 			buttonVariants({ size: "lg", variant: "default" }),
// 			// 			"font-medium gap-[10px]",
// 			// 		)}
// 			// 	>
// 			// 		<IconWallet className="w-5 h-auto flex-shrink-0 z-10" />
// 			// 		Connect Wallet
// 			// 	</div>
// 			// </DynamicConnectButton>
// 			null
// 		);

// 	if (address && chain?.id !== metis.id) {
// 		return (
// 			<DropdownMenu>
// 				<DropdownMenuTrigger asChild>
// 					<Button
// 						size="lg"
// 						variant="destructive"
// 						className="font-medium gap-[10px]"
// 					>
// 						Switch to Metis
// 						<IconChevronDown className="w-3 h-auto flex-shrink-0 z-10 ml-2" />
// 					</Button>
// 				</DropdownMenuTrigger>
// 				<DropdownMenuContent
// 					align="end"
// 					className="w-[257px] overflow-hidden rounded-2xl"
// 				>
// 					{/* <DropdownMenuItem
// 						className="h-11 gap-1 text-sm text-white/80 hover:text-white cursor-pointer"
// 						onClick={() => primaryWallet?.switchNetwork(metis.id)}
// 					>
// 						Switch to Metis Network
// 					</DropdownMenuItem>
// 					<DropdownMenuItem
// 						className="h-11 gap-1 text-sm text-white/80 hover:text-white cursor-pointer"
// 						onClick={() => {
// 							disconnect();
// 							handleLogOut();
// 						}}
// 					>
// 						<IconLogout className="w-6 h-auto" />
// 						Disconnect
// 					</DropdownMenuItem> */}
// 				</DropdownMenuContent>
// 			</DropdownMenu>
// 		);
// 	}

// 	return (
// 		<DropdownMenu>
// 			<DropdownMenuTrigger asChild>
// 				<Button size="lg" variant="outline" className="font-medium gap-[10px]">
// 					{shortenAddress(address)}
// 					<IconChevronDown className="w-3 h-auto flex-shrink-0 z-10" />
// 				</Button>
// 			</DropdownMenuTrigger>
// 			<DropdownMenuContent
// 				align="end"
// 				className="w-[257px] overflow-hidden rounded-2xl"
// 			>
// 				<DropdownMenuItem className="flex justify-between h-11">
// 					<div className="flex items-center leading-0 gap-1">
// 						{shortenAddress(address)}
// 					</div>
// 					<div className="flex items-center gap-1">
// 						<button
// 							type="button"
// 							onClick={() => copyToClipboard(address)}
// 							className="hover:scale-105 transition-all"
// 						>
// 							<IconCopyGradient className="w-[18px] h-auto z-10" />
// 						</button>
// 					</div>
// 				</DropdownMenuItem>
// 				<DropdownMenuItem className="h-11 gap-1 text-sm text-white/80 hover:text-white cursor-pointer">
// 					<Link
// 						to={`/profile/${address}`}
// 						className="flex items-center gap-1 w-full"
// 					>
// 						<UserRound className="w-5 h-auto" />
// 						Profile
// 					</Link>
// 				</DropdownMenuItem>
// 				<DropdownMenuItem
// 					className="h-11 gap-1 text-sm text-white/80 hover:text-white cursor-pointer"
// 					onClick={() => {
// 						disconnect();
// 						// handleLogOut();
// 					}}
// 				>
// 					<IconLogout className="w-6 h-auto" />
// 					Logout
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// };
