// import { useAccount } from "@/hooks/mini-app/useAccount";

// import {
// 	Button,
// 	buttonVariants,
// 	type ButtonProps,
// } from "@/components/ui/button";
// // import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
// import { cn } from "@/lib/utils";

// export const ButtonWithWallet = ({
// 	children,
// 	onClick,
// 	...props
// }: ButtonProps) => {
// 	const { isConnected } = useAccount();

// 	if (!isConnected) {
// 		return (
// 			// <DynamicConnectButton buttonContainerClassName="w-fit">
// 			// 	<div
// 			// 		className={cn(
// 			// 			buttonVariants({ variant: "default" }),
// 			// 			props.className,
// 			// 		)}
// 			// 	>
// 			// 		Connect Wallet
// 			// 	</div>
// 			// </DynamicConnectButton>
// 			null
// 		);
// 	}

// 	return (
// 		<Button
// 			{...props}
// 			onClick={(e) => {
// 				onClick?.(e);
// 			}}
// 		>
// 			{children}
// 		</Button>
// 	);
// };
