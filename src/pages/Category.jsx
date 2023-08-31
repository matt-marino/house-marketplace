import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const rent = params.categoryName === "rent";
    console.log('listings', listings);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, "listings");
                const q = query(
                    listingsRef,
                    where("type", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(10)
                );
                const querySnapshot = await getDocs(q);
                const listings = [];
                querySnapshot.forEach((doc) => {
                    listings.push({ data: doc.data(), id: doc.id });
                });
                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error("Something went wrong getting listings");
            }
        };
        fetchListings();
    }, [params.categoryName]);
  return (
    <div className="category">
        <header>
            <p className="pageHeader">
                {rent ? 'Places for Rent' : 'Places for Sale'}
            </p>
        </header>
        {loading ? (
            <Spinner />
        ) : listings && listings.length > 0 ?
        (
            <>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing) => (
                        <ListingItem
                            listing={listing.data}
                            id={listing.id}
                            key={listing.id}
                        />
                    ))}
                </ul>
            </main>
            </>
        ) : (
            <p className="noListings">No listings for {params.categoryName}</p>
        )}
    </div>
  )
}
export default Category;
