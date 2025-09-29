// import { useTransactionControllerFindNewestTransaction } from "@/services/queries";
// import { getTransactionControllerFindNewestTransactionQueryKey } from "@/services/queries";

// const formatItem = (transaction: TransactionResponse) => {
// 	const logo = transaction.pumpe?.logo || "";
// 	const symbol = transaction.pumpe?.symbol || "";
// 	const pumpeAddress = transaction.pumpeAddress;
// 	let owner = "";
// 	let action = "";
// 	let isUser = true;

// 	if (transaction.type === TransactionResponseType.PumpTokenCreated) {
// 		owner = transaction.pumpe?.owner || "";
// 		action = "Created";
// 	}

// 	if (transaction.type === TransactionResponseType.Buy) {
// 		owner = transaction.recipient;
// 		action = "Bought";
// 	}

// 	if (transaction.type === TransactionResponseType.Sell) {
// 		owner = transaction.recipient;
// 		action = "Sold";
// 	}

// 	if (transaction.type === TransactionResponseType.List) {
// 		isUser = false;
// 		owner = transaction.pumpeAddress;
// 		action = "Listed";
// 	}

// 	if (transaction.type === TransactionResponseType.Pump) {
// 		isUser = false;
// 		owner = transaction.pumpeAddress;
// 		action = "Pumped";
// 	}

// 	return {
// 		isUser,
// 		owner,
// 		action,
// 		symbol,
// 		logo,
// 		pumpeAddress,
// 	};
// };

export function HeaderMarquee() {
  // const queryClient = useQueryClient();
  // const isMobile = useMediaQuery("(max-width: 768px)");

  // const { data: tokensResponse } =
  // 	useTransactionControllerFindNewestTransaction({});
  // let topTenTransactions = take(tokensResponse ?? [], 10);

  // useEffect(() => {
  // 	// Subscribe to new transaction updates
  // 	subscribeToChannel(StreamingEventName.SubscribeGlobalTrading);
  // 	onStreamingMessage(
  // 		StreamingEventName.SubscribeGlobalTrading,
  // 		(transaction: TransactionResponse) => {
  // 			queryClient.setQueryData(
  // 				getTransactionControllerFindNewestTransactionQueryKey(),
  // 				(prev: TransactionResponse[] | undefined) => {
  // 					if (!prev) return [transaction];
  // 					// Add new transaction to the beginning and maintain only latest 10
  // 					const updated = [transaction, ...prev];
  // 					return take(updated, 10);
  // 				},
  // 			);
  // 		},
  // 	);

  // 	return () => {
  // 		unsubscribeToChannel(StreamingEventName.SubscribeGlobalTrading);
  // 	};
  // }, [queryClient]);

  // // If there are less than 10 tokens, loop them to fill the marquee
  // if (topTenTransactions.length < 10 && topTenTransactions.length > 0) {
  // 	const loopedTokens = [];
  // 	while (loopedTokens.length < 10) {
  // 		loopedTokens.push(...topTenTransactions);
  // 	}
  // 	topTenTransactions = loopedTokens.slice(0, 10);
  // }

  // if (topTenTransactions.length === 0) {
  // 	return null;
  // }

  // const formattedItems = (topTenTransactions as TransactionResponse[]).map(
  // 	(item) => formatItem(item),
  // );

  return (
    // <div className="w-full container py-2 bg-background">
    // 	<Marquee gradient={!isMobile} gradientColor="#150F0A">
    // 		{formattedItems.map((item, index) => (
    // 			<div
    // 				key={index.toString()}
    // 				className="flex items-center justify-center gap-1 p-[6px] pl-4"
    // 			>
    // 				<Link to={`/profile/${item.owner}`}>
    // 					<span className="text-foreground text-sm font-medium">
    // 						{headAddress(item.owner)}
    // 					</span>
    // 				</Link>
    // 				<span className="text-white/40 text-sm font-normal lowercase">
    // 					{item.action}
    // 				</span>
    // 				<Link
    // 					to={`/tokens/${item.pumpeAddress}`}
    // 					className="flex items-center gap-1"
    // 				>
    // 					<span className="text-gradient font-extrabold text-sm">
    // 						{item.symbol}
    // 					</span>
    // 					<Image
    // 						src={item.logo}
    // 						alt="logo"
    // 						className="w-5 h-5 rounded-full mb-[4px]"
    // 					/>
    // 				</Link>

    // 				<Separator
    // 					orientation="vertical"
    // 					className="h-5 bg-[#3B3B3B] ml-3"
    // 				/>
    // 			</div>
    // 		))}
    // 	</Marquee>
    // </div>
    null
  );
}
