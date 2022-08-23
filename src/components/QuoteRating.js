import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function QuoteRating({quoteId}) {
    const [averageRating, setAverageRating] = useState()
    const [commentRated, setCommentRated] = useState(false)
    const [firstRating, setFirstRating] = useState(false)
    const [rating, setRating] = useState()
    const [randomRating, setRandomRating] = useState()

    useEffect(() => {
        let cancel
        axios({
        method: 'GET',
        url: `http://localhost:3001/quoteRatings?id=${quoteId}`,
        cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if(!res.data.length) {
                setFirstRating(prevFirstRating => prevFirstRating = true)
            } else {
                setRating(prevRating => (
                    { 
                        ...prevRating,
                        ...res.data[0]
                    }
                    ))
            }

        }).catch(e => {
            if (axios.isCancel(e)) return
        })

        return () => {
            cancel()
            setFirstRating(false)
            setCommentRated(false)
            setAverageRating(false)
            setRandomRating()
        }
    }, [quoteId])

    useEffect(() => {
        if(commentRated && rating) {
            setAverageRating(
                // parse float with 1 decimal
                parseFloat(
                    // Sum of all ratings devided by amount of ratings
                    rating.ratings.reduce((a, b) => (a + b.rating),0) / rating.ratings.length
                ).toFixed(1))
        }
    }, [commentRated, rating])

    function handleRatingClick(e) {
        const userGivenRating = parseInt(e.target.id.substr(e.target.id.length - 1))
        if(firstRating) {
            // handle first rating ever on quote
            axios({
                method: 'POST',
                url: `http://localhost:3001/quoteRatings`,
                data: {
                    "id": quoteId,
                    "ratings": [
                        {
                            "name": "Test User",
                            "rating": userGivenRating
                        }
                    ]
                }
            }).then(res => {
                setRating(res.data)
                setCommentRated(true)
            }).catch(e => {
                if (axios.isCancel(e)) return
            })
        } else {
            // handle new rating on quote with ratings
            let newRatingsObject = rating;
            newRatingsObject.ratings.push({name: "Test User", rating: userGivenRating});
            axios({
                method: 'PATCH',
                url: `http://localhost:3001/quoteRatings/${quoteId}`,
                data: newRatingsObject
            }).then(res => {
                setRandomRating(prevRandomRating => prevRandomRating = rating.ratings[Math.floor(Math.random()*rating.ratings.length)])
                setRating(prevRating => prevRating = res.data)
                setCommentRated(true)
            }).catch(e => {
                if (axios.isCancel(e)) return
            })
        }
    }
    return (
        <>
            {/* only show rating UI when user has not rated the current quote */}
            {!commentRated && <div className='starRating'>
                <input onClick={handleRatingClick} type="radio" id="rating-5"/>
                <label htmlFor="rating-5"></label>
                <input onClick={handleRatingClick} type="radio" id="rating-4"/>
                <label htmlFor="rating-4"></label>
                <input onClick={handleRatingClick} type="radio" id="rating-3"/>
                <label htmlFor="rating-3"></label>
                <input onClick={handleRatingClick} type="radio" id="rating-2"/>
                <label htmlFor="rating-2"></label>
                <input onClick={handleRatingClick} type="radio" id="rating-1"/>
                <label htmlFor="rating-1"></label>
            </div>}
            {/* replace rating UI with average rating after user has rated current quote */}
            {commentRated && <div>This comment has a rating of {averageRating}</div>}
            {/* random rating will only been shown when you are not the only one who was commented on the current quote */}
            {randomRating && <div><h3><i>{randomRating.name} rated this quote a {randomRating.rating}</i></h3></div>}
        </>
    )
}
