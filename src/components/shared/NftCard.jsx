import React from "react";
import { Link } from "react-router-dom";
import AuthorImageFallback from "../../images/author_thumbnail.jpg";
import nftImageFallback from "../../images/nftImage.jpg";
import CountdownTimer from "./CountdownTimer";
import Skeleton from "./Skeleton";

  const NftCard = ({ item, loading = false }) => {
  const isPlaceholder = loading || !item;

  const itemId = item?.nftId ?? item?.id ?? item?._id ?? "";


  const authorId = item?.authorId ?? item?.creatorId ?? "";


  const authorImage = item?.authorImage ?? AuthorImageFallback;
  const nftImage =
  item?.nftImage ??
  item?.image ??
  item?.img ??
  item?.imageURL ??
  item?.imageUrl ??
  item?.nftImageUrl ??
  item?.nftUrl ??
  item?.nft ??
  nftImageFallback;


  const title = item?.title ?? item?.nftName ?? "Pinky Ocean";
  const price = item?.price ?? 1.74;
  const likes = item?.likes ?? 69;
  const expiryDate = item?.expiryDate ?? item?.endDate ?? null;
  const expiresAt = typeof item?.expiresAt === "number" ? item.expiresAt : null;
  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <Link
          to={isPlaceholder ? "#" : `/author/${authorId}`}
          onClick={(e) => isPlaceholder && e.preventDefault()}
        >
          {isPlaceholder ? (
            <Skeleton width={40} height={40} borderRadius={999} />
          ) : (
            <img src={authorImage} alt="" />
          )}
          <i className="fa fa-check"></i>
        </Link>
      </div>

      {!isPlaceholder ? (
        <CountdownTimer expiryDate={expiryDate} expiresAt={expiresAt} />
      ) : (
        <div style={{ marginTop: 10 }}>
          <Skeleton width={120} height={16} borderRadius={6} />
        </div>
      )}

      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <button disabled={isPlaceholder}>Buy Now</button>
          </div>
        </div>

        <Link
          to={isPlaceholder || !itemId ? "#" : `/item-details/${itemId}`}

          onClick={(e) => isPlaceholder && e.preventDefault()}
        >
          {isPlaceholder ? (
            <Skeleton width="100%" height={240} borderRadius={12} />
          ) : (
            <img src={nftImage} className="nft__item_preview" alt={title} />

          )}
        </Link>
      </div>

      <div className="nft__item_info">
        <Link
         to={isPlaceholder || !itemId ? "#" : `/item-details/${itemId}`}

          onClick={(e) => isPlaceholder && e.preventDefault()}
        >
          {isPlaceholder ? (
            <Skeleton width="70%" height={18} borderRadius={6} />
          ) : (
            <h4>{title}</h4>
          )}
        </Link>

        <div className="nft__item_price">
          {isPlaceholder ? (
            <Skeleton width={90} height={16} borderRadius={6} />
          ) : (
            `${Number(price).toFixed(2)} ETH`
          )}
        </div>

        <div className="nft__item_like">
          <i className="fa fa-heart"></i>
          <span>{isPlaceholder ? "—" : likes}</span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;