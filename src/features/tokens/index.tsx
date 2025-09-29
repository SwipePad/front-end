import IconSearchGradient from "@/assets/icons/search-gradient.svg?react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokensHero } from "@/features/tokens/components/tokens-hero";
import {
  StreamingEventName,
  onStreamingMessage,
  subscribeToChannel,
  unsubscribeToChannel,
} from "@/lib/socket";
import {
  PumpeAndPriceResponse,
  PumpeControllerFindPaginationSortBy,
  PumpeControllerFindPaginationStatus,
} from "@/services/models";
// import {
// 	getPumpeControllerFindPaginationQueryKey,
// 	usePumpeControllerFindPagination,
// } from "@/services/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const pageSize = 12;

const filterOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Bonding" },
  { value: "upcoming", label: "Upcoming" },
  { value: "voting", label: "Voting" },
  { value: "completed", label: "Dex" },
];

const sortOptions = [
  { value: "createTime", label: "Created Time" },
  { value: "volume1h", label: "Volume" },
  { value: "marketCap", label: "Market Cap" },
];

export function Tokens() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createTime");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setPage(1);
  };

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      search: searchQuery,
      sortBy: sortBy as PumpeControllerFindPaginationSortBy,
      status:
        activeFilter === "all" ? undefined : (activeFilter as PumpeControllerFindPaginationStatus),
    }),
    [page, searchQuery, sortBy, activeFilter]
  );

  // const { data: tokensResponse, isLoading } =
  // 	usePumpeControllerFindPagination(queryParams);
  // const tokens = tokensResponse?.data ?? [];
  // const totalPages = Math.ceil((tokensResponse?.total ?? 0) / pageSize);
  // const visiblePages = getPaginationVisiblePages(page, totalPages);

  const availableSortOptions = useMemo(() => {
    if (activeFilter === "voting") {
      return [...sortOptions, { value: "totalVoting", label: "Vote Progress" }];
    }
    return sortOptions;
  }, [activeFilter]);

  useEffect(() => {
    subscribeToChannel(StreamingEventName.SubscribeNewPumpe);
    onStreamingMessage(StreamingEventName.SubscribeNewPumpe, (pumpe: PumpeAndPriceResponse) => {
      if (!pumpe) return;

      // queryClient.setQueryData(
      // 	getPumpeControllerFindPaginationQueryKey(queryParams),
      // 	(prev: PumpeResponseList | undefined): PumpeResponseList => {
      // 		if (!prev) {
      // 			return {
      // 				data: [pumpe],
      // 				page: 1,
      // 				pageSize,
      // 				total: 1,
      // 			};
      // 		}

      // 		console.log(
      // 			"pumpe.status",
      // 			pumpe.status,
      // 			queryParams.status,
      // 			pumpe,
      // 		);

      // 		if (queryParams.status && queryParams.status !== pumpe.status) {
      // 			return prev;
      // 		}

      // 		const existingIndex = prev.data.findIndex(
      // 			(p) => p.tokenId === pumpe.tokenId,
      // 		);

      // 		if (existingIndex !== -1) {
      // 			const updatedPumpes = [...prev.data];
      // 			updatedPumpes[existingIndex] = pumpe;
      // 			const updated = {
      // 				...prev,
      // 				data: updatedPumpes,
      // 			};

      // 			return updated;
      // 		}

      // 		const updated = {
      // 			...prev,
      // 			data: take([pumpe, ...prev.data], pageSize),
      // 			total: prev.total + 1,
      // 		};

      // 		return updated;
      // 	},
      // );
    });

    return () => {
      unsubscribeToChannel(StreamingEventName.SubscribeNewPumpe);
    };
  }, [queryClient, queryParams]);

  return (
    <>
      <TokensHero />

      <div className="container">
        <div className="mt-8 flex flex-col gap-4">
          {/* Mobile: Sort and Badge dropdowns */}
          <div className="flex w-full gap-2 lg:hidden">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              // disabled={isLoading}
            >
              <SelectTrigger className="border-gradient w-full items-center justify-center rounded-full px-2 font-bold text-white/80">
                <SelectValue placeholder="Sort By: Forge">
                  Sort By:{" "}
                  <span className="text-gradient">
                    {sortOptions.find(opt => opt.value === sortBy)?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableSortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={activeFilter}
              onValueChange={handleFilterChange}
              // disabled={isLoading}
            >
              <SelectTrigger className="border-gradient items-center justify-center rounded-full font-bold text-white/80">
                <SelectValue placeholder="Badge">
                  Badge:{" "}
                  <span className="text-gradient">
                    {filterOptions.find(opt => opt.value === activeFilter)?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: Filter Pills and Search/Sort */}
          <div className="hidden w-full items-center justify-between gap-2 lg:flex">
            {/* Filter Pills */}
            <div className="flex gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  // disabled={isLoading}
                  // className={cn(
                  // 	`h-10 px-7 py-2 rounded-full text-sm font-medium transition-colors`,
                  // 	activeFilter === option.value
                  // 		? "bg-btn-gradient text-primary-foreground"
                  // 		: "bg-transparent text-white/80 border-gradient hover:bg-white/10",
                  // 	isLoading && "opacity-50 cursor-not-allowed",
                  // )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2 xl:gap-4">
              <div className="border-gradient pointer-events-none relative w-[300px] rounded-full">
                <IconSearchGradient className="text-muted-foreground absolute left-3 top-1/2 z-10 h-auto w-4 -translate-y-1/2" />
                <Input
                  placeholder="Dex"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pointer-events-auto pl-9"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gradient w-[220px] items-center justify-center rounded-full font-bold text-white/80">
                  <SelectValue placeholder="Sort By: Created Time">
                    Sort By:{" "}
                    <span className="text-gradient">
                      {availableSortOptions.find(opt => opt.value === sortBy)?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableSortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile: Search bar */}
          <div className="border-gradient pointer-events-none relative w-full rounded-full lg:hidden">
            <IconSearchGradient className="text-muted-foreground absolute left-3 top-1/2 z-10 h-auto w-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pointer-events-auto pl-9"
            />
          </div>
        </div>

        {/* <div className="mt-6">
					{isLoading ? (
						<TokenGrid.Skeleton />
					) : tokens.length > 0 ? (
						<>
							<TokenGrid tokens={tokens} />
							{totalPages > 1 && (
								<div className="flex justify-center mt-8">
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={() =>
														setPage((prev) => Math.max(prev - 1, 1))
													}
													className={cn(
														"text-white/60 hover:text-white",
														(page === 1 || isLoading) &&
															"pointer-events-none opacity-50",
													)}
												/>
											</PaginationItem>

											{visiblePages.map((pageNum, index) => (
												<PaginationItem key={index}>
													{pageNum === "ellipsis" ? (
														<PaginationEllipsis />
													) : (
														<PaginationLink
															onClick={() => setPage(pageNum)}
															isActive={page === pageNum}
															className={cn(
																"text-white/60 hover:text-white rounded-none",
																page === pageNum &&
																	"bg-btn-gradient text-white before:rounded-none",
															)}
														>
															{pageNum}
														</PaginationLink>
													)}
												</PaginationItem>
											))}

											<PaginationItem>
												<PaginationNext
													onClick={() =>
														setPage((prev) => Math.min(prev + 1, totalPages))
													}
													className={cn(
														"text-white/60 hover:text-white",
														page === totalPages &&
															"pointer-events-none opacity-50",
													)}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							)}
						</>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<p className="text-lg text-white/80 mb-2">No tokens found</p>
							<p className="text-sm text-white/60">
								{searchQuery || activeFilter !== "all"
									? "Try adjusting your search or filters"
									: "Tokens will appear here once they are created"}
							</p>
							{(searchQuery || activeFilter !== "all") && (
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => {
										setSearchQuery("");
										setActiveFilter("all");
									}}
								>
									Clear filters
								</Button>
							)}
						</div>
					)}
				</div> */}
      </div>
    </>
  );
}
