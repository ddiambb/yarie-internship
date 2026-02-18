import React, { useEffect, useMemo, useState } from "react";
import NftCard from "../shared/NftCard";

  const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const placeholders = useMemo(() => new Array(8).fill(null), []);

  const buildUrl = (filterValue) => {
  const base =
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
    return filterValue
      ? `${base}?filter=${encodeURIComponent(filterValue)}`
      : base;
  };

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setVisibleCount(8);

    fetch(buildUrl(filter))
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("explore error:", err))
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filter]);

  const sliced = items.slice(0, visibleCount);
  const canLoadMore = !loading && visibleCount < items.length;

  const onLoadMore = (e) => {
    e.preventDefault();
    setVisibleCount((prev) => Math.min(prev + 4, items.length));
  };

  return (
    <>
      <div style={{ width: "100%", marginBottom: 20 }}>
        <select
          id="filter-items"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {(loading ? placeholders : sliced).map((item, index) => (
        <div
          key={item?.nftId ?? item?.id ?? item?._id ?? index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <NftCard item={item} loading={loading} />
        </div>
      ))}

      <div className="col-md-12 text-center">
        {canLoadMore && (
          <a
            href="#"
            id="loadmore"
            className="btn-main lead"
            onClick={onLoadMore}
          >
            Load more
          </a>
        )}
      </div>
    </>
  );
};

export default ExploreItems;
