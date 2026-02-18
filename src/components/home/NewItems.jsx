import React, { useEffect, useMemo, useState } from "react";
import NftCard from "../shared/NftCard";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const placeholders = useMemo(() => new Array(4).fill(null), []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("newItems error:", err))
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const listToRender = loading ? placeholders : items.slice(0, 4);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {listToRender.map((item, index) => (
            <div key={item?.id ?? item?._id ?? index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <NftCard item={item} loading={loading} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewItems;