// import { usePumpeControllerFindStarOfPump } from "@/services/queries";

// const SocialButton = ({
// 	href,
// 	children,
// }: {
// 	href: string;
// 	children: React.ReactNode;
// }) => {
// 	const handleClick = (e: React.MouseEvent) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		window.open(href, "_blank");
// 	};

// 	return (
// 		<button
// 			onClick={handleClick}
// 			className="inline-flex items-center justify-center"
// 		>
// 			{children}
// 		</button>
// 	);
// };

export const TokensHero = () => {
  // const { data: starToken, isLoading } = usePumpeControllerFindStarOfPump({});

  // const totalRaised = get(starToken, "totalRaised", 0);
  // const priceCurrent = get(starToken, "priceNow", 0);
  // const priceLast5m = +get(starToken, "price24hBefore", 0) || priceCurrent;

  // const priceChange =
  // 	priceCurrent && priceLast5m
  // 		? BigNumber(priceCurrent)
  // 				.minus(priceLast5m)
  // 				.dividedBy(priceLast5m)
  // 				.multipliedBy(100)
  // 				.toNumber()
  // 		: 0;

  // const progress = new BigNumber(totalRaised)
  // 	.dividedBy(LIQUIDITY_THRESHOLD.toFixed(0))
  // 	.times(100)
  // 	.toNumber();

  // if (isLoading) {
  // 	return (
  // 		<div className="relative w-full min-h-[600px]">
  // 			<Skeleton className="w-full h-full absolute inset-0" />
  // 		</div>
  // 	);
  // }

  // if (!starToken) {
  // 	return null;
  // }

  // return (
  // 	<div className="relative w-full h-auto xl:min-h-[600px]">
  // 		<Image
  // 			src={TokensBackgroundImage}
  // 			alt="Tokens Hero"
  // 			className="absolute xl:relative w-full h-full object-cover"
  // 		/>
  // 		<div className="relative xl:absolute inset-0">
  // 			<div className="flex items-start py-8 xl:py-0 xl:items-center justify-center h-full px-4">
  // 				<div className="relative flex flex-col xl:flex-row items-center gap-10 lg:gap-16 xl:gap-4">
  // 					<div className="text-gradient-highlight text-center xl:text-right flex-shrink-0 [&_br]:hidden xl:[&_br]:block">
  // 						KING OF
  // 						<br />
  // 						&nbsp;PUMPE
  // 					</div>

  // 					<Link
  // 						to="/tokens/$tokenId"
  // 						params={{ tokenId: starToken.address }}
  // 						className="block"
  // 					>
  // 						<div className="relative bg-[#241D07] rounded-2xl p-6 max-w-[680px] 2xl:max-w-[760px] border border-primary shadow-[0_4px_20px_0_rgba(255,193,92,0.60)]">
  // 							<Image
  // 								src={KingFireTopImage}
  // 								alt="Fire Top"
  // 								className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-[80%] pointer-events-none"
  // 							/>
  // 							<Image
  // 								src={KingFireBottomImage}
  // 								alt="Fire Bottom"
  // 								className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-[80%] pointer-events-none"
  // 							/>
  // 							<div className="flex flex-col lg:flex-row gap-6 flex-shrink-0">
  // 								{/* main card: Image */}
  // 								<div className="w-[280px] min-w-[280px] h-[280px] rounded-2xl mx-auto overflow-hidden">
  // 									<Image
  // 										src={starToken.logo || DEFAULT_IMAGE}
  // 										alt={starToken.name}
  // 										className="w-full h-full rounded-xl object-cover"
  // 									/>
  // 								</div>

  // 								{/* main card: Content */}
  // 								<div className="lg:min-w-[280px]">
  // 									<div className="flex justify-start items-center gap-[10px] mb-5">
  // 										<TokenStatusBadge status={starToken.status} />
  // 										<PercentageChangeBadge
  // 											value={priceChange}
  // 											className="border-none"
  // 										/>
  // 									</div>

  // 									<div className="mb-3 flex items-center justify-between">
  // 										<h2 className="text-xl leading-none font-bold text-white">
  // 											{starToken.name}{" "}
  // 											<span className="text-white/80 font-normal">
  // 												${starToken.symbol}
  // 											</span>
  // 										</h2>

  // 										<div className="flex items-center justify-center gap-[6px]">
  // 											{starToken.x && (
  // 												<SocialButton href={starToken.x}>
  // 													<IconX className="w-6 h-6" />
  // 												</SocialButton>
  // 											)}
  // 											{starToken.telegram && (
  // 												<SocialButton href={starToken.telegram}>
  // 													<IconTelegram className="w-6 h-6" />
  // 												</SocialButton>
  // 											)}
  // 										</div>
  // 									</div>

  // 									<p className="text-white/60 mb-4 line-clamp-2">
  // 										{starToken.description}
  // 									</p>

  // 									<CreatedBy
  // 										creator={starToken.ownerInfo?.name || starToken.owner}
  // 										address={starToken.owner}
  // 										avatar={starToken.ownerInfo?.avatar}
  // 										className="mb-8"
  // 									/>

  // 									<InfoList
  // 										className="mb-6"
  // 										items={[
  // 											{
  // 												key: "Price after pump",
  // 												value: `$${formatWithSubscript(
  // 													starToken.priceAfterPump.toString(),
  // 												)}`,
  // 											},
  // 											{
  // 												key: "Market Cap",
  // 												value: `$${toCurrency(starToken.marketCap)}`,
  // 											},
  // 										]}
  // 									/>

  // 									<ProgressWithLabel
  // 										value={progress}
  // 										showLabel
  // 										labelPosition="middle"
  // 									/>
  // 								</div>
  // 							</div>
  // 						</div>
  // 					</Link>

  // 					<div className="text-gradient-highlight flex-shrink-0 opacity-0 pointer-events-none hidden xl:block">
  // 						KING OF
  // 						<br />
  // 						PUMPE
  // 					</div>
  // 				</div>
  // 			</div>
  // 		</div>
  // 	</div>
  // );
  return null;
};
