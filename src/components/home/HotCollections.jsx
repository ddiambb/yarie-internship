import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import Slider from "react-slick";

const HotCollections = () => {
const [hotCollections, setHotCollections] = useState([]);  
const [loading, setLoading] = useState(true);


const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
  
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  {
    breakpoint: 560,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,

    },
  },
  ],
  
  
};

  useEffect(() => {
    setLoading(true);
    fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections")
    .then((res) => res.json())
    .then((data) => setHotCollections(data))
    .catch((err) => console.error("hotCollections error:", err))
    .finally(() => setLoading(false));
  }, []);

const skeletonItems = new Array(6).fill(0);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <Slider {...settings}>

          {(loading ? skeletonItems : hotCollections).map((item, index) => (
            <div key={item?.id || index}>
              <div className={`nft_coll ${loading ? "skeleton" : ""}`}>
                <div className={`nft_wrap ${loading ? "skeleton" : ""}`}>
                  {!loading  && (
                  <Link to="/item-details">
                    <img src={item?.nftImage || nftImage} 
                    className="lazy img-fluid" 
                    alt="" />
                  </Link>
                )}
                </div>
                
                <div className="nft_coll_pp">
                  {!loading && (
                  <Link to="/author">
                    <img className="lazy pp-coll" 
                    src={item?.authorImage || AuthorImage} 
                    alt="" />
                  </Link>
                  )}
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  {loading ? (
                    <>
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-subtitle" />
                    </>
                    ) : (  
                      <>
                    
                  <Link to="/explore">
                    <h4>{item?.title || "Hot Collection"}</h4>
                  </Link>
                  <span>{item?.code || item?.tag || "ERC-192"}</span>
                  </>
                  )}
                </div>
              </div>
            </div>
          ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
