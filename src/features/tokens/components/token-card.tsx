import { TokenStatusBadge } from "@/components/token/token-status-badge";
import { PercentageChangeBadge } from "@/components/token/percentage-change-badge";
import { CreatedBy } from "@/components/token/created-by";
import { Card } from "@/components/ui/card";
import IconX from "@/assets/icons/x.svg?react";
import IconTelegram from "@/assets/icons/telegram.svg?react";
import { Link } from "@tanstack/react-router";
import { ProgressWithLabel } from "@/components/ui/progress-with-label";
import { InfoList } from "@/components/shared/info-list";
import type { PumpeAndPriceResponse, UserResponse } from "@/services/models";
import { get } from "es-toolkit/compat";
import { LIQUIDITY_THRESHOLD } from "@/constants/blockchain";
import BigNumber from "bignumber.js";
import { formatWithSubscript, toCurrency } from "@/lib/number";
import { formatDistanceToNow } from "date-fns";
import { Globe } from "lucide-react";
import { DEFAULT_IMAGE, VOTING_LIMIT } from "@/constants/common";
import { Image } from "@/components/ui/image";

const SocialLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(href, "_blank");
  };

  return (
    <button onClick={handleClick} className="inline-flex items-center justify-center">
      {children}
    </button>
  );
};

export const TokenCard = (token: PumpeAndPriceResponse) => {
  const tokenDeployId = get(token, "tokenId");
  const logo = get(token, "logo");
  const name = get(token, "name");
  const address = get(token, "address");
  const symbol = get(token, "symbol");
  const description = get(token, "description");
  const marketCap = get(token, "marketCap");
  const status = get(token, "status");
  const x = get(token, "x");
  const telegram = get(token, "telegram");
  const website = get(token, "website");
  const creator = get(token, "ownerInfo", {} as UserResponse);
  const createdAt = get(token, "created_at");
  const voteCount = get(token, "totalVoting", 0);

  const totalRaised = get(token, "totalRaised", 0);
  const priceCurrent = get(token, "priceNow", 0);
  const priceAfterPump = get(token, "priceAfterPump", 0);
  const priceLast5m = +get(token, "price24hBefore", 0) || +priceCurrent;

  const priceChange =
    priceCurrent && priceLast5m
      ? BigNumber(priceCurrent)
          .minus(priceLast5m)
          .dividedBy(priceLast5m)
          .multipliedBy(100)
          .toNumber()
      : 0;

  const progress = totalRaised
    ? new BigNumber(totalRaised).dividedBy(LIQUIDITY_THRESHOLD.toFixed(0)).times(100).toNumber()
    : 0;

  const voteProgress = BigNumber(voteCount).div(VOTING_LIMIT).multipliedBy(100).toNumber();

  const infoListItems = [
    ...(status === "voting"
      ? [
          {
            key: "Created",
            value: createdAt
              ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
              : "N/A",
          },
          {
            key: "Votes",
            value: formatWithSubscript(voteCount.toString()),
          },
        ]
      : [
          {
            key: "Price after pump",
            value: priceAfterPump ? `$${formatWithSubscript(priceAfterPump.toString())}` : "N/A",
          },
          {
            key: "Market Cap",
            value: marketCap ? `$${toCurrency(marketCap, { decimals: 2 })}` : "N/A",
          },
        ]),
  ];

  return (
    <Link to="/tokens/$tokenId" params={{ tokenId: address || tokenDeployId }} className="block">
      <Card className="overflow-hidden rounded-2xl border-none bg-[#443A34] p-4 transition-transform hover:scale-[1.02]">
        <div className="relative w-full pb-[100%]">
          {/* Main Image */}
          <Image
            src={logo || DEFAULT_IMAGE}
            alt={name}
            className="absolute inset-0 h-full w-full rounded-[14px] object-cover"
            crossOrigin="anonymous"
          />

          {/* Status Badges */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <TokenStatusBadge status={status} />
            <PercentageChangeBadge value={priceChange} />
          </div>
        </div>

        <div className="mt-[10px]">
          {/* Title and Social Links */}
          <div className="mb-1 flex items-start justify-between">
            <h3 className="line-clamp-1 text-xl font-bold text-white">
              {name} <span className="text-white/80">${symbol}</span>
            </h3>
            <div className="flex gap-1">
              {x && (
                <SocialLink href={x}>
                  <IconX className="h-6 w-6 text-white" />
                </SocialLink>
              )}
              {telegram && (
                <SocialLink href={telegram}>
                  <IconTelegram className="h-6 w-6 text-white" />
                </SocialLink>
              )}
              {website && (
                <SocialLink href={website}>
                  <div className="rounded-full bg-white p-1">
                    <Globe className="h-4 w-4 text-black" />
                  </div>
                </SocialLink>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mb-2 line-clamp-1 text-base text-white/80">{description || <>&nbsp;</>}</p>

          {/* Creator */}
          <CreatedBy
            creator={creator?.name || creator?.walletAddress}
            avatar={creator?.image}
            address={creator?.walletAddress}
          />

          {/* Price and Market Cap */}
          <InfoList className="mb-4 mt-4" items={infoListItems} />

          {/* Progress Bar */}
          <ProgressWithLabel
            value={status === "voting" ? voteProgress : progress}
            showLabel
            labelPosition="middle"
          />
        </div>
      </Card>
    </Link>
  );
};
