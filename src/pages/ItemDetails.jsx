import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import AuthorImageFallback from "../images/author_thumbnail.jpg";
import nftImageFallback from "../images/nftImage.jpg";

const ItemDetails = () => {
  const { itemId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPlaceholder = useMemo(() => loading || !itemId, [loading, itemId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    let isMounted = true;

    if (!itemId) {
      setItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const url =
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=" +
      encodeURIComponent(itemId);

    fetch(url)
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
  }, [itemId]);

  const title = item?.title || "NFT Item";
  const description = item?.description || "";
  const price = item?.price ?? 0;
  const likes = item?.likes ?? 0;
  const views = item?.views ?? 0;
  const image =
    item?.nftImage ||
    item?.image ||
    item?.imageUrl ||
    item?.img ||
    nftImageFallback;

  const authorId = item?.authorId || item?.author?.authorId || "";
  const authorName = item?.authorName || item?.author?.name || "Unknown";
  const authorImage =
    item?.authorImage || item?.author?.image || AuthorImageFallback;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={image}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={title}
                />
                {isPlaceholder && (
                  <div style={{ marginTop: 12, opacity: 0.7 }}>
                    Loading item details…
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="item_info">
                  <h2>{title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i> {views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i> {likes}
                    </div>
                  </div>

                  <p>{description}</p>

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={isPlaceholder || !authorId ? "#" : `/author/${authorId}`}
                            onClick={(e) =>
                              (isPlaceholder || !authorId) && e.preventDefault()
                            }
                          >
                            <img className="lazy" src={authorImage} alt={authorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        <div className="author_list_info">
                          <Link
                            to={isPlaceholder || !authorId ? "#" : `/author/${authorId}`}
                            onClick={(e) =>
                              (isPlaceholder || !authorId) && e.preventDefault()
                            }
                          >
                            {authorName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>

                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link
                            to={isPlaceholder || !authorId ? "#" : `/author/${authorId}`}
                            onClick={(e) =>
                              (isPlaceholder || !authorId) && e.preventDefault()
                            }
                          >
                            <img className="lazy" src={authorImage} alt={authorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        <div className="author_list_info">
                          <Link
                            to={isPlaceholder || !authorId ? "#" : `/author/${authorId}`}
                            onClick={(e) =>
                              (isPlaceholder || !authorId) && e.preventDefault()
                            }
                          >
                            {authorName}
                          </Link>
                        </div>
                      </div>

                      <div className="spacer-40"></div>

                      <h6>Price</h6>
                      <div className="nft-item-price">
                        <img src={EthImage} alt="ETH" />
                        <span>{Number(price).toFixed(2)}</span>
                      </div>
                    </div>

                    {!loading && itemId && !item && (
                      <div style={{ marginTop: 12, color: "#c00" }}>
                        Couldn’t load item #{itemId}. Check the endpoint or itemId.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
