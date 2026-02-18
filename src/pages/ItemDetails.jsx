import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SubHeader from "../images/subheader.jpg";
import AuthorImageFallback from "../images/author_thumbnail.jpg";
import nftImageFallback from "../images/nftImage.jpg";
import CountdownTimer from "../components/shared/CountdownTimer";
import Skeleton from "../components/shared/Skeleton";



const ItemDetails = () => {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const detailsUrl = useMemo(() => {
    // Most common for this internship backend:
    // itemDetails?nftId=<id>
    return `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${encodeURIComponent(
      itemId || ""
    )}`;
  }, [itemId]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!itemId) return;

    let isMounted = true;
    setLoading(true);

    fetch(detailsUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setItem(data && typeof data === "object" ? data : null);
      })
      .catch((err) => console.error("itemDetails error:", err))
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [detailsUrl, itemId]);

  const authorId = item?.authorId ?? "";
  const authorName = item?.authorName ?? "Author";
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

  const title = item?.title ?? item?.nftName ?? "NFT Item";
  const price = item?.price ?? 0;
  const likes = item?.likes ?? 0;

  const expiryDate = item?.expiryDate ?? item?.endDate ?? null;
  const expiresAt = typeof item?.expiresAt === "number" ? item.expiresAt : null;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="subheader"
          className="text-light"
          style={{ background: `url("${SubHeader}") top` }}
        >
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Item Details</h1>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {/* Image */}
              <div className="col-md-6 text-center">
                {loading ? (
                  <Skeleton width="100%" height={420} borderRadius={12} />
                ) : (
                  <img
                    src={nftImage}
                    alt={title}
                    style={{ width: "100%", height: "auto", borderRadius: 12 }}
                  />
                )}
              </div>

              {/* Details */}
              <div className="col-md-6">
                {loading ? (
                  <>
                    <Skeleton width="70%" height={26} borderRadius={8} />
                    <div style={{ height: 12 }} />
                    <Skeleton width="40%" height={18} borderRadius={8} />
                    <div style={{ height: 24 }} />
                    <Skeleton width="100%" height={120} borderRadius={12} />
                  </>
                ) : (
                  <>
                    <h2>{title}</h2>

                    <div style={{ margin: "12px 0" }}>
                      <CountdownTimer expiryDate={expiryDate} expiresAt={expiresAt} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <img
                        src={authorImage}
                        alt={authorName}
                        style={{ width: 44, height: 44, borderRadius: "50%" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{authorName}</div>
                        {authorId ? (
                          <Link to={`/author/${authorId}`}>View author</Link>
                        ) : (
                          <span />
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: 18, marginBottom: 10 }}>
                      <strong>{Number(price).toFixed(2)} ETH</strong>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <i className="fa fa-heart"></i> {likes}
                    </div>

                    <button className="btn-main">Buy Now</button>
                    <Link to="/explore" className="btn-main" style={{ marginLeft: 10 }}>
                      Back to Explore
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
